import { Router } from 'express';
import bookmarkController from '../controllers/bookmark.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { createBookmarkSchema, updateBookmarkSchema } from '../schemas/bookmark.schema';
import { validate } from '../middlewares/validation.middleware';

const bookmarkRouter = Router();

bookmarkRouter.get('/', asyncHandler(bookmarkController.getAll));
bookmarkRouter.get('/:id', asyncHandler(bookmarkController.getById));
bookmarkRouter.post('/', validate(createBookmarkSchema), asyncHandler(bookmarkController.create));
bookmarkRouter.put('/:id', validate(updateBookmarkSchema), asyncHandler(bookmarkController.update));
bookmarkRouter.delete('/:id', asyncHandler(bookmarkController.delete));

export default bookmarkRouter;
