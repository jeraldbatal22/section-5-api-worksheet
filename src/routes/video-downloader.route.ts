// src/routes/video-downloader.routes.ts
import { Router } from 'express';
import videoDownloaderController from '../controllers/video-downloader.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validate } from '../middlewares/validation.middleware';
import { videoDownloaderSchema } from '../schemas/video-donwloader.schema';

const videoDownloaderRouter = Router();

videoDownloaderRouter.post(
  '/download',
  validate(videoDownloaderSchema),
  asyncHandler(videoDownloaderController.createVideoDownload)
);

videoDownloaderRouter.get('/', asyncHandler(videoDownloaderController.getUserVideoDownloads));

export default videoDownloaderRouter;
