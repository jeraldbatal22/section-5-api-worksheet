import type { Response } from 'express';
import chatService from '../services/chat.service.ts';
import type { IAuthRequest } from '../types/index.ts';
import { ResponseHandler } from '../utils/response-handler.ts';

class ChatController {
  async sendMessage(req: IAuthRequest, res: Response) {
    const { content, receiver_id, upload_to } = req.body;
    const created = await chatService.sendMessage(
      String(req.user?.id),
      receiver_id,
      content,
      req.file,
      upload_to
    );
    ResponseHandler.success(res, created || null, 'Message sent successfully', 201);
  }

  async getMessagesByUserId(req: IAuthRequest, res: Response): Promise<void> {
    const receiver_id = req.query.receiver_id as string;

    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const page = parseInt(req.query.page as string);

    const result = await chatService.getChatHistory(String(req?.user?.id), {
      receiver_id: String(receiver_id),
      pagination: {
        limit,
        offset,
        page,
      },
    });

    ResponseHandler.success(res, result.data || null, 'Retrieved chat history successfully');
  }

  async getMessageById(req: IAuthRequest, res: Response): Promise<void> {
    const message_id = req.params.id;
    const message = await chatService.getSingleMessageById(message_id, String(req.user?.id));
    ResponseHandler.success(res, message || null, 'Retrieved message successfully');
  }

  async deleteMessageById(req: IAuthRequest, res: Response): Promise<void> {
    const message_id = req.params.id;
    await chatService.deleteMessage(message_id, String(req.user?.id));
    ResponseHandler.success(res, null, 'Message deleted successfully');
  }
}

export default new ChatController();
