import { FileEntityType } from "../model/file.model.ts";
import { v4 as uuidv4 } from "uuid";
import uploadService from "./upload.service.ts";
import chatRepository from "../repositories/chat.repository.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

class ChatService {
  private chatRepo: typeof chatRepository;
  private uploadService: typeof uploadService;

  constructor() {
    this.chatRepo = chatRepository;
    this.uploadService = uploadService;
  }

  async sendMessage(
    senderId: string,
    receiverId: string,
    content: string,
    file?: Express.Multer.File,
    uploadTo?: "aws-s3" | "supabase-storage"
  ) {
    let fileUrl: string | undefined
    // Upload file if provided
    const chatId = uuidv4();

    if (file) {
      if (uploadTo === "aws-s3") {
        const uploadResult = await this.uploadService.uploadFileToAwsS3(file, {
          entityType: FileEntityType.CHAT,
          entityId: chatId,
          userId: senderId,
        });
        fileUrl = uploadResult.url;
      }
      if (uploadTo === "supabase-storage") {
        const uploadResult = await this.uploadService.uploadFileToSupabase(file, {
          entityType: FileEntityType.CHAT,
          entityId: chatId,
          userId: senderId,
        });
        console.log(uploadResult, "uploadResult")
        fileUrl = uploadResult.url;
      }
    }

    // Create chat message
    const chat = await this.chatRepo.create({
      content,
      sender_id: senderId,
      receiver_id: receiverId,
      file_url: fileUrl,
    });

    return chat;
  }

  async getSingleMessageById(messageId: string, userId: string) {
    const message = await this.chatRepo.findSingleMessageByUserId(messageId, userId);
    if (!message) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");

    return message;
  }

  async getChatHistory(userId1: string, userId2: string) {
    return await this.chatRepo.findBetweenUsers(userId1, userId2);
  }

  async deleteMessage(messageId: string, userId: string) {
    const chat = await this.chatRepo.deleteMessage(messageId, userId);

    if (!chat) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");
    }

  }
}

export default new ChatService();