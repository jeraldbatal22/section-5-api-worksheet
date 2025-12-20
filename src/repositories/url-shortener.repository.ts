import { SupabaseClient } from '@supabase/supabase-js';
import { getSupabaseDatabase } from '../config/supabase.config';
import { T_CreateShortenUrlInput } from '../schemas/url-shortener.schema';
import { I_UrlShortener } from '../models/url-shortener.model';

export class UrlShortenerRepository {
  private supabase: SupabaseClient;
  private tableName = 'url_shorteners';

  constructor() {
    this.supabase = getSupabaseDatabase();
  }

  // Create a shortened URL (shortenUrl)
  async shortenUrl(
    userId: number | string,
    data: T_CreateShortenUrlInput
  ): Promise<I_UrlShortener> {
    const { url: original_url, shorten_url: short_url } = data;
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId,
        original_url,
        short_url,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !result) {
      throw new Error(`Database error: ${error?.message ?? 'Unknown error'}`);
    }
    return result as I_UrlShortener;
  }

  // Get all shortened urls by userId (getUrlShortenerByUserId)
  async getUrlShortenerByUserId(
    userId: number | string,
    limit: number = 10,
    offset: number = 0
  ): Promise<I_UrlShortener[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data ?? []) as I_UrlShortener[];
  }

  // Find by short code
  async findByShortCode(shorten_url: string): Promise<I_UrlShortener | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('short_url', shorten_url)
      .single();

    if (error || !data) return null;
    return data as I_UrlShortener;
  }
}

export default new UrlShortenerRepository();
