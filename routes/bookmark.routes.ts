import { Router } from 'express';
import bookmarkController from '../controller/bookmark.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { createBookmarkSchema, updateBookmarkSchema } from '../schemas/bookmark.schema.ts';
import { validate } from '../middleware/validation.middleware.ts';

const bookmarkRouter = Router();

bookmarkRouter.get('/', asyncHandler(bookmarkController.getAll));
bookmarkRouter.get('/:id', asyncHandler(bookmarkController.getById));
bookmarkRouter.post('/', validate(createBookmarkSchema), asyncHandler(bookmarkController.create));
bookmarkRouter.put('/:id', validate(updateBookmarkSchema), asyncHandler(bookmarkController.update));
bookmarkRouter.delete('/:id', asyncHandler(bookmarkController.delete));

export default bookmarkRouter;
