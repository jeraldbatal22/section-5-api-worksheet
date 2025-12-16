import type { Response } from "express";
import BookmarkService from "../services/bookmark.service.ts";
import type { IAuthRequest } from "../types/index.ts";

class BookmarkController {
  async create(req: IAuthRequest, res: Response): Promise<void> {
    const { url, title } = req.body;
    const bookmark = await BookmarkService.createBookmark(
      req.user?.id as number,
      { url, title }
    );

    res.status(201).json({
      success: true,
      data: bookmark,
      message: "Successfully created bookmark",
    });
  }

  async getAll(req: IAuthRequest, res: Response): Promise<void> {
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 50;
    const offset = req.query.offset
      ? parseInt(req.query.offset as string, 10)
      : 0;

    const result = await BookmarkService.getBookmarks(req.user?.id as number, {
      limit,
      offset,
    });

    res.status(200).json({
      success: true,
      data: result.bookmarks,
      pagination: result.pagination,
      message: "Successfully fetched bookmarks",
    });
  }

  async getById(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;

    const bookmark = await BookmarkService.getBookmarkById(
      req.user?.id as number,
      id
    );

    res.status(200).json({
      success: true,
      data: bookmark,
      message: "Successfully fetched bookmark",
    });
  }

  async update(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    const { url, title } = req.body;

    const bookmark = await BookmarkService.updateBookmark(
      req.user?.id as number,
      id,
      {
        url,
        title,
      }
    );

    res.status(200).json({
      success: true,
      data: bookmark,
      message: "Successfully updated bookmark",
    });
  }

  async delete(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    await BookmarkService.deleteBookmark(req.user?.id as number, id);

    res.status(200).json({
      success: true,
      data: null,
      message: "Successfully Deleted Bookmark",
    });
  }
}

export default new BookmarkController();
