import  { I_Bookmark } from '../models/bookmark.model';
import HttpStatus from 'http-status';
import { PaginationHelper } from '../utils/pagination.util';
import  { T_CreateBookmarkInput, T_UpdateBookmarkInput } from '../schemas/bookmark.schema';
import { AppError } from '../middlewares/error-handler.middleware';
import bookmarkRepository from '../repositories/bookmark.repository';

interface BookmarkListOptions {
  limit?: number;
  offset?: number;
  page?: number;
}

class BookmarkService {
  // Create a new bookmark for a user
  async createBookmark(userId: number, data: T_CreateBookmarkInput): Promise<I_Bookmark> {
    // Validation: URL is required and must be string
    if (!data.url || typeof data.url !== 'string' || data.url.trim().length === 0) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'URL is required.');
    }
    // Optionally allow title to be empty, but if provided, must be string
    if (data.title !== undefined && typeof data.title !== 'string') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Title must be a string.');
    }

    const bookmarkInput: T_CreateBookmarkInput = {
      url: data.url.trim(),
      title: (data.title || '').trim(),
    };

    try {
      return await bookmarkRepository.createBookmark(userId, bookmarkInput);
    } catch (e: any) {
      if (e instanceof Error && e.message === 'BOOKMARK_ALREADY_EXISTS') {
        throw new AppError(HttpStatus.CONFLICT, 'Bookmark already exists.');
      }
      throw e;
    }
  }

  // Get all bookmarks for a user (with pagination)
  async getBookmarks(userId: number, options: BookmarkListOptions = {}): Promise<any> {
    const { limit, offset } = PaginationHelper.normalize(options);

    const totalCount = await bookmarkRepository.getTotalCountBookmarks(userId);
    const bookmarks = await bookmarkRepository.readBookmarks(userId, limit, offset);
    return PaginationHelper.paginate(bookmarks, totalCount, { limit, offset });
  }

  // Get a single bookmark for a user
  async getBookmarkById(userId: number, bookmarkId: number | string): Promise<I_Bookmark> {
    const bookmark = await bookmarkRepository.readBookmark(bookmarkId, userId);
    if (!bookmark) throw new AppError(HttpStatus.NOT_FOUND, 'Bookmark not found.');
    return bookmark;
  }

  // Update a bookmark
  async updateBookmark(
    userId: number,
    bookmarkId: number | string,
    updateData: T_UpdateBookmarkInput
  ): Promise<I_Bookmark> {
    if (updateData.url === undefined && updateData.title === undefined) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'No fields to update.');
    }

    // If updating url
    if (updateData.url !== undefined) {
      if (
        !updateData.url ||
        typeof updateData.url !== 'string' ||
        updateData.url.trim().length === 0
      ) {
        throw new AppError(HttpStatus.BAD_REQUEST, 'URL is required.');
      }
      updateData.url = updateData.url.trim();
    }

    // If updating title
    if (updateData.title !== undefined) {
      if (typeof updateData.title !== 'string') {
        throw new AppError(HttpStatus.BAD_REQUEST, 'Title must be a string.');
      }
      updateData.title = updateData.title.trim();
    }

    try {
      const updated = await bookmarkRepository.updateBookmark(bookmarkId, userId, updateData);
      if (!updated) throw new AppError(HttpStatus.NOT_FOUND, 'Bookmark not found.');
      return updated;
    } catch (e: any) {
      if (e instanceof Error && e.message === 'BOOKMARK_ALREADY_EXISTS') {
        throw new AppError(HttpStatus.CONFLICT, 'Bookmark already exists.');
      }
      throw e;
    }
  }

  // Delete a bookmark
  async deleteBookmark(userId: number, bookmarkId: number | string): Promise<void> {
    const deleted = await bookmarkRepository.deleteBookmark(bookmarkId, userId);
    if (!deleted) throw new AppError(HttpStatus.NOT_FOUND, 'Bookmark not found.');
  }
}

export default new BookmarkService();
