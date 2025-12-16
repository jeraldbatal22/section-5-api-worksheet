import { SupabaseClient } from "@supabase/supabase-js";
import type {
  CreateVideoDownloadDto,
  UpdateVideoDownloadDto,
} from "../model/video-downloader.model.ts";
import supabase from "../utils/supabase/server.ts";

export interface VideoDownload {
  id: number;
  user_id: number;
  url: string;
  file_path?: string;
  file_size?: number;
  error_message?: string;
  created_at: string; // supabase returns ISO string by default
  updated_at: string;
}

class VideoDownloadRepository {
  private supabase: SupabaseClient;
  private tableName = "video_downloads";

  constructor() {
    this.supabase = supabase;
  }

  async create(dto: CreateVideoDownloadDto): Promise<VideoDownload> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        status: "pending",
        user_id: dto.user_id,
        url: dto.url,
      })
      .select("*")
      .single();
    if (error || !data) {
      throw new Error(`Database error: ${error?.message ?? "Unknown error"}`);
    }
    return data as VideoDownload;
  }

  async findById(id: number): Promise<VideoDownload | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();

    if (error || !data) return null;
    return data as VideoDownload;
  }

  async findByUserId(
    userId: number | string,
    limit: number = 10,
    offset: number = 0
  ): Promise<VideoDownload[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data ?? []) as VideoDownload[];
  }

  async update(
    id: number,
    dto: UpdateVideoDownloadDto
  ): Promise<VideoDownload | null> {
    console.log(id, dto);
    if (dto.file_size === undefined && dto.error_message === undefined) {
      // Nothing to update, return as is
      return this.findById(id);
    }

    // Only pick defined fields
    const updateFields: Partial<UpdateVideoDownloadDto> = {};

    if (dto.status !== undefined) updateFields.status = dto.status;
    if (dto.file_size !== undefined) updateFields.file_size = dto.file_size;
    if (dto.error_message !== undefined)
      updateFields.error_message = dto.error_message;

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateFields)
      .eq("id", id)
      .select("*")
      .single();

    if (error || !data) return null;
    return data as VideoDownload;
  }
}

export default new VideoDownloadRepository();
