import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseDatabase } from '../config/supabase.config';
import { AppError } from '../middlewares/error-handler.middleware';
import { T_InstagramPost } from '../schemas/instagram.schema';

class InstagramPostRepository {
  private supabase: SupabaseClient;
  private tableName = 'instagram_posts';

  constructor() {
    this.supabase = getSupabaseDatabase();
  }

  // Create a new Instagram post
  async createPost(data: any): Promise<T_InstagramPost> {
    const { data: post, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: data.user_id,
        caption: data.caption ?? null,
        media_url: data.url,
        media_type: data.media_type,
      })
      .select('*')
      .single();

    if (error) throw new AppError(500, `Supabase insert error: ${error.message}`);
    return post as T_InstagramPost;
  }

  // Update an Instagram post by post id and user id
  async updatePost(
    postId: number | string,
    userId: number | string,
    data: any
  ): Promise<T_InstagramPost | null> {
    // Only send defined fields
    const payload: any = {};
    if (data.caption !== undefined) payload.caption = data.caption;
    if (data.url !== undefined) payload.media_url = data.url;
    if (data.media_type !== undefined) payload.media_type = data.media_type;
    payload.updated_at = new Date().toISOString();
    console.log(payload);
    if (Object.keys(payload).length === 1) return null; // only updated_at was set, nothing to update

    const { data: updated, error } = await this.supabase
      .from(this.tableName)
      .update(payload)
      .eq('id', postId)
      .eq('user_id', userId)
      .select('*')
      .single();

    if (error) throw new AppError(500, `Supabase update error: ${error.message}`);
    if (!updated) return null;
    return updated as T_InstagramPost;
  }

  // Get a post by id and user_id
  async getPostByIdAndUserId(
    postId: number | string,
    userId: number | string
  ): Promise<T_InstagramPost | null> {
    const { data: post, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', postId)
      .eq('user_id', userId)
      .single();

    if (error || !post) return null;
    return post as T_InstagramPost;
  }

  // Get all posts by a user id
  async getAllPostsByUserId(userId: number | string): Promise<T_InstagramPost[]> {
    const { data: posts, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw new AppError(500, `Supabase fetch error: ${error.message}`);
    return posts as T_InstagramPost[];
  }

  // Delete a post by post id and user id
  async deletePostById(postId: number | string, userId: number | string): Promise<boolean> {
    const { error, data } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('id', postId)
      .eq('user_id', userId)
      .select('id')
      .single();

    if (error) {
      // Record not found should return false, not throw
      if (error.code === 'PGRST116' || error.code === 'PGRST204') return false;
      throw new AppError(500, `Supabase delete error: ${error.message}`);
    }
    return !!data;
  }
}

export default new InstagramPostRepository();
