import {  SupabaseClient } from '@supabase/supabase-js';
import { ChatModel, type IChat } from '../model/chat.model.ts';
import supabase from '../utils/supabase/server.ts';

export class ChatRepository {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = supabase;
  }

  async create(chatData: IChat): Promise<ChatModel> {
    const { data, error } = await this.supabase
      .from('chats')
      .insert(chatData)
      .select(`
        *
      `)
      .single();

    if (error) throw new Error(`Database error: ${error.message}`);
    return new ChatModel(data);
  }

  async findBetweenUsers(userId1: string, userId2: string): Promise<ChatModel[]> {
    const { data, error } = await this.supabase
      .from('chats')
      .select(`
        *
      `)
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true });

    if (error) throw new Error(`Database error: ${error.message}`);
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
      if (error.code === 'PGRST116' || error.code === 'PGRST204') return false;
      throw new Error(`Database error: ${error.message}`);
    }
    // If data is null, message not found or not owned by user
    return !!data;
  }
}

export default new ChatRepository();