// src/routes/video-downloader.routes.ts
import { Router } from 'express';
import videoDownloaderController from '../controller/video-downloader.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { videoDownloaderSchema } from '../schemas/video-donwloader.schema.ts';

const videoDownloaderRouter = Router();

videoDownloaderRouter.post(
  '/download',
  validate(videoDownloaderSchema),
  asyncHandler(videoDownloaderController.createVideoDownload)
);

videoDownloaderRouter.get('/', asyncHandler(videoDownloaderController.getUserVideoDownloads));

export default videoDownloaderRouter;
