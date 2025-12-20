import { FileEntityType } from '../models/file.model';
import { v4 as uuidv4 } from 'uuid';
import uploadService from './upload.service';
import chatRepository from '../repositories/chat.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';
import { PaginationHelper } from '../utils/pagination.util';

export interface ChatListOptions {
  receiver_id: string;
  pagination: { limit?: number; offset?: number; page?: number };
}

class ChatService {
  private chatRepo: typeof chatRepository;
  private uploadService: typeof uploadService;

  constructor() {
    this.chatRepo = chatRepository;
    this.uploadService = uploadService;
  }

  async sendMessage(
    sender_id: string,
    receiver_id: string,
    content: string,
    file?: any,
    upload_to?: 'aws-s3' | 'supabase-storage'
  ) {
    let fileUrl: string | undefined;
    const chatId = uuidv4();

    if (file) {
      if (upload_to === 'aws-s3') {
        const uploadResult = await this.uploadService.uploadFileToAwsS3(file, {
          entityType: FileEntityType.CHAT,
          entityId: chatId,
          userId: sender_id,
        });
        fileUrl = uploadResult.url;
      }
      if (upload_to === 'supabase-storage') {
        const uploadResult = await this.uploadService.uploadFileToSupabase(file, {
          entityType: FileEntityType.CHAT,
          entityId: chatId,
          userId: sender_id,
        });
        fileUrl = uploadResult.url;
      }
    }

    const chat = await this.chatRepo.create({
      content,
      sender_id: sender_id,
      receiver_id: receiver_id,
      file_url: fileUrl,
    });

    return chat;
  }

  async getSingleMessageById(message_id: string, user_id: string) {
    const message = await this.chatRepo.findSingleMessageByUserId(message_id, user_id);
    if (!message) throw new AppError(HttpStatus.BAD_REQUEST, 'Message not found');

    return message;
  }

  async getChatHistory(userId: string, options: ChatListOptions) {
    const { limit, offset } = PaginationHelper.normalize(options.pagination);
    const count = await this.chatRepo.getTotalCountChats(userId, options.receiver_id);
    const chats = await this.chatRepo.findBetweenUsers(userId, options.receiver_id, {
      limit,
      offset,
    });
    return PaginationHelper.paginate(chats, count, options.pagination);
  }

  async deleteMessage(message_id: string, user_id: string) {
    await this.chatRepo.deleteMessage(message_id, user_id);
  }
}

export default new ChatService();
