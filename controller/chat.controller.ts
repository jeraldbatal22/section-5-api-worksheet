import type { Response } from "express";
import chatService from "../services/chat.service.ts";
import type { IAuthRequest } from "../types/index.ts";

class ChatController {
  async sendMessage(req: IAuthRequest, res: Response) {
    const { content, receiver_id, uploadTo } = req.body;
    const created = await chatService.sendMessage(
      req.user?.id as any,
      receiver_id,
      content,
      req.file as any,
      uploadTo
    );
    res.status(201).json({
      success: true,
      data: created || null,
      message: "Message sent successfully",
    });
  }

  async getMessagesByUserId(req: IAuthRequest, res: Response): Promise<void> {
    const receiverId = req.query.receiver_id as string;

    const result = await chatService.getChatHistory(
      req.user?.id as string,
      receiverId
    );
    res.status(200).json({
      success: true,
      data: result || null,
      message: "Retrieved chat history successfully",
    });
  }

  async getMessageById(req: IAuthRequest, res: Response): Promise<void> {
    const messageId = req.params.id;
    const message = await chatService.getSingleMessageById(
      messageId,
      req.user?.id as any
    );
    res.status(200).json({
      success: true,
      data: message || null,
      message: "Retrieved message successfully",
    });
  }

  async deleteMessageById(
    req: IAuthRequest,
    res: Response,
  ): Promise<void> {
    const messageId = req.params.id;
    await chatService.deleteMessage(messageId, req?.user?.id as any);
    res.status(200).json({
      success: true,
      data: null,
      message: "Message deleted successfully",
    });
  }
}

export default new ChatController();
