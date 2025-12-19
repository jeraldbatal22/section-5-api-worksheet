import type { Response } from 'express';
import BookmarkService from '../services/bookmark.service.ts';
import type { IAuthRequest } from '../types/index.ts';
import { ResponseHandler } from '../utils/response-handler.ts';
import HttpStatus from 'http-status';

class BookmarkController {
  async create(req: IAuthRequest, res: Response): Promise<void> {
    const { url, title } = req.body;
    const bookmark = await BookmarkService.createBookmark(req.user?.id as number, { url, title });

    ResponseHandler.success(res, bookmark, 'Successfully created bookmark', 201);
  }

  async getAll(req: IAuthRequest, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const page = parseInt(req.query.page as string);

    const result = await BookmarkService.getBookmarks(req.user?.id as number, {
      limit,
      offset,
      page,
    });

    ResponseHandler.success(
      res,
      result.data,
      'Successfully fetched bookmarks',
      HttpStatus.OK,
      result.pagination
    );
  }

  async getById(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;

    const bookmark = await BookmarkService.getBookmarkById(req.user?.id as number, id);

    ResponseHandler.success(res, bookmark, 'Successfully fetched bookmark');
  }

  async update(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const { url, title } = req.body;

    const bookmark = await BookmarkService.updateBookmark(req.user?.id as number, id, {
      url,
      title,
    });

    ResponseHandler.success(res, bookmark, 'Successfully updated bookmark');
  }

  async delete(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    await BookmarkService.deleteBookmark(req.user?.id as number, id);

    ResponseHandler.success(res, null, 'Successfully Deleted Bookmark');
  }
}

export default new BookmarkController();
