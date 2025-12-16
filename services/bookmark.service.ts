import type {
  Bookmark,
  CreateBookmarkDTO,
  UpdateBookmarkDTO,
} from '../model/bookmark.model.ts';
import bookmarkRepository from '../repositories/bookmark.repository.ts';
import { ErrorResponse } from '../utils/error-response.ts';
import HttpStatus from 'http-status';

interface BookmarkListOptions {
  limit?: number;
  offset?: number;
}

interface BookmarkListResult {
  bookmarks: Bookmark[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    hasMore: boolean;
  };
}

class BookmarkService {
  // Create a new bookmark for a user
  async createBookmark(userId: number, data: CreateBookmarkDTO): Promise<Bookmark> {
    // Validation: URL is required and must be string
    if (!data.url || typeof data.url !== "string" || data.url.trim().length === 0) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, "URL is required.");
    }
    // Optionally allow title to be empty, but if provided, must be string
    if (data.title !== undefined && typeof data.title !== "string") {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");
    }

    const bookmarkInput: CreateBookmarkDTO = {
      url: data.url.trim(),
      title: (data.title || "").trim(),
    };

    try {
      return await bookmarkRepository.createBookmark(userId, bookmarkInput);
    } catch (e: any) {
      if (e instanceof Error && e.message === "BOOKMARK_ALREADY_EXISTS") {
        throw new ErrorResponse(HttpStatus.CONFLICT, "Bookmark already exists.");
      }
      throw e;
    }
  }

  // Get all bookmarks for a user (with pagination)
  async getBookmarks(
    userId: number,
    options: BookmarkListOptions = {}
  ): Promise<BookmarkListResult> {
    const limit = options.limit !== undefined ? options.limit : 50;
    const offset = options.offset !== undefined ? options.offset : 0;

    // Basic validation
    if (limit < 1 || limit > 100) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid limit (must be between 1 and 100).");
    if (offset < 0) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Invalid offset (must be 0 or greater).");

    const bookmarks = await bookmarkRepository.readBookmarks(userId, limit, offset);

    const hasMore = bookmarks.length === limit;

    return {
      bookmarks,
      pagination: {
        total: offset + bookmarks.length + (hasMore ? 1 : 0),
        limit,
        offset,
        hasMore,
      },
    };
  }

  // Get a single bookmark for a user
  async getBookmarkById(userId: number, bookmarkId: number | string): Promise<Bookmark> {
    const bookmark = await bookmarkRepository.readBookmark(bookmarkId, userId);
    if (!bookmark) throw new ErrorResponse(HttpStatus.NOT_FOUND, "Bookmark not found.");
    return bookmark;
  }

  // Update a bookmark
  async updateBookmark(
    userId: number,
    bookmarkId: number | string,
    updateData: UpdateBookmarkDTO
  ): Promise<Bookmark> {
    if (
      updateData.url === undefined &&
      updateData.title === undefined
    ) {
      throw new ErrorResponse(HttpStatus.BAD_REQUEST, "No fields to update.");
    }

    // If updating url
    if (updateData.url !== undefined) {
      if (
        !updateData.url ||
        typeof updateData.url !== "string" ||
        updateData.url.trim().length === 0
      ) {
        throw new ErrorResponse(HttpStatus.BAD_REQUEST, "URL is required.");
      }
      updateData.url = updateData.url.trim();
    }

    // If updating title
    if (updateData.title !== undefined) {
      if (typeof updateData.title !== "string") {
        throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Title must be a string.");
      }
      updateData.title = updateData.title.trim();
    }

    try {
      const updated = await bookmarkRepository.updateBookmark(bookmarkId, userId, updateData);
      if (!updated) throw new ErrorResponse(HttpStatus.NOT_FOUND, "Bookmark not found.");
      return updated;
    } catch (e: any) {
      if (e instanceof Error && e.message === "BOOKMARK_ALREADY_EXISTS") {
        throw new ErrorResponse(HttpStatus.CONFLICT, "Bookmark already exists.");
      }
      throw e;
    }
  }

  // Delete a bookmark
  async deleteBookmark(userId: number, bookmarkId: number | string): Promise<void> {
    const deleted = await bookmarkRepository.deleteBookmark(bookmarkId, userId);
    if (!deleted) throw new ErrorResponse(HttpStatus.NOT_FOUND, "Bookmark not found.");
  }
}

export default new BookmarkService();