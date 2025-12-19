import { Router } from 'express';
import shortenUrlController from '../controller/shorten-url.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { createShortenUrlSchema } from '../schemas/url-shortener.schema.ts';

const shortenUrlRouter = Router();

shortenUrlRouter.post(
  '/',
  validate(createShortenUrlSchema),
  asyncHandler(shortenUrlController.create)
);
shortenUrlRouter.get('/', asyncHandler(shortenUrlController.getAll));
shortenUrlRouter.get('/:shortCode', asyncHandler(shortenUrlController.getByShortCode));

export default shortenUrlRouter;
