import { SupabaseClient } from "@supabase/supabase-js";
import type {
  Bookmark,
  CreateBookmarkDTO,
  UpdateBookmarkDTO,
} from "../model/bookmark.model.ts";
import supabase from "../utils/supabase/server.ts";

class BookmarkRepository {
  private supabase: SupabaseClient;
  private tableName = "bookmarks";

  constructor() {
    this.supabase = supabase;
  }

  // Create a new bookmark
  async createBookmark(
    userId: number,
    data: CreateBookmarkDTO
  ): Promise<Bookmark> {
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId,
        url: data.url,
        title: data.title ?? null,
      })
      .select("*")
      .single();
    if (error) {
      // Unique index on (user_id, url)
      if (
        error.code === "23505" ||
        error.message.includes("duplicate key") ||
        error.message.includes("already exists")
      ) {
        throw new Error("BOOKMARK_ALREADY_EXISTS");
      }
      throw new Error(`Database error: ${error.message}`);
    }
    return rows as Bookmark;
  }

  // Get all bookmarks for a user, with pagination
  async readBookmarks(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<Bookmark[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) throw new Error(`Database error: ${error.message}`);
    return (data ?? []) as Bookmark[];
  }

  // Get a bookmark by its id and user_id
  async readBookmark(
    bookmarkId: number | string,
    userId: number
  ): Promise<Bookmark | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", bookmarkId)
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data as Bookmark;
  }

  // Update a bookmark for a user
  async updateBookmark(
    bookmarkId: number | string,
    userId: number,
    updateData: UpdateBookmarkDTO
  ): Promise<Bookmark | null> {
    const updateObj: Record<string, any> = {};
    if (updateData.url !== undefined) updateObj.url = updateData.url;
    if (updateData.title !== undefined) updateObj.title = updateData.title;
    updateObj.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateObj)
      .eq("id", bookmarkId)
      .eq("user_id", userId)
      .select("*")
      .single();

    if (error) {
      // Unique index on (user_id, url)
      if (
        error.code === "23505" ||
        error.message.includes("duplicate key") ||
        error.message.includes("already exists")
      ) {
        throw new Error("BOOKMARK_ALREADY_EXISTS");
      }
      return null;
    }
    if (!data) return null;
    return data as Bookmark;
  }

  // Delete a bookmark for a user
  async deleteBookmark(
    bookmarkId: number | string,
    userId: number
  ): Promise<boolean> {
    const { error, data } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", bookmarkId)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();

    if (error) return false;
    return !!data;
  }
}

export default new BookmarkRepository();
