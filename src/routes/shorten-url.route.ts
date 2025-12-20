import { Router } from 'express';
import shortenUrlController from '../controllers/shorten-url.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createShortenUrlSchema } from '../schemas/url-shortener.schema';

const shortenUrlRouter = Router();

shortenUrlRouter.post(
  '/',
  validate(createShortenUrlSchema),
  asyncHandler(shortenUrlController.create)
);
shortenUrlRouter.get('/', asyncHandler(shortenUrlController.getAll));
shortenUrlRouter.get('/:shortCode', asyncHandler(shortenUrlController.getByShortCode));

export default shortenUrlRouter;
