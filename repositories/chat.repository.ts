import { SupabaseClient } from '@supabase/supabase-js';
import { ChatModel, type IChat } from '../model/chat.model.ts';
import { getSupabaseDatabase } from '../config/supabase.config.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import HttpStatus from 'http-status';

export class ChatRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = getSupabaseDatabase();
  }

  async create(chatData: IChat): Promise<ChatModel> {
    const { data, error } = await this.supabase
      .from('chats')
      .insert(chatData)
      .select(
        `
        *
      `
      )
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return new ChatModel(data);
  }

  // Get Total Count
  async getTotalCountChats(senderId: string | number, receiverId: string | number) {
    const { count, error } = await this.supabase
      .from('chats')
      .select('id', { count: 'exact', head: true })
      .or(
        `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
      )
      .eq('sender_id', senderId);
    if (error) throw new AppError(HttpStatus.BAD_REQUEST, `Database error: ${error.message}`);

    return count ?? 0;
  }

  async findBetweenUsers(
    senderId: string,
    receiverId: string,
    options: {
      limit: number;
      offset: number;
    }
  ): Promise<ChatModel[]> {
    const { data, error } = await this.supabase
      .from('chats')
      .select(`*`)
      .or(
        `and(sender_id.eq.${senderId},receiver_id.eq.${receiverId}),and(sender_id.eq.${receiverId},receiver_id.eq.${senderId})`
      )
      .order('created_at', { ascending: true })
      .range(options.offset, options.offset + options.limit - 1);

    if (error) throw new AppError(HttpStatus.BAD_REQUEST, `Database error: ${error.message}`);
    return data.map(c => new ChatModel(c as any));
  }

  async findSingleMessageByUserId(messageId: string, userId: string): Promise<ChatModel | null> {
    const { data, error } = await this.supabase
      .from('chats')
      .select('*')
      .eq('id', messageId)
      .or(`sender_id.eq.${userId},receiver_id.eq.${userId}`)
      .single();

    if (error || !data) return null;
    return new ChatModel(data as any);
  }

  /**
   * Delete a chat message by its id, only if the user is the sender (userId).
   * @param messageId - the id of the chat message to delete
   * @param userId - the id of the user (must be the sender of the message)
   * @returns boolean (true if deleted, false otherwise)
   */
  async deleteMessage(messageId: string, userId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from('chats')
      .delete()
      .eq('id', messageId)
      .eq('sender_id', userId)
      .select('id')
      .single();

    if (error) {
      // If no row was found to delete, return false
      throw new AppError(HttpStatus.BAD_REQUEST, `Database error: ${error.message}`);
    }
    // If data is null, message not found or not owned by user
    return !!data;
  }
}

export default new ChatRepository();
