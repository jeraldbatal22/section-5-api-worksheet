import type { NextFunction, Response } from 'express';
import type { CreateVideoDownloadDto } from '../model/video-downloader.model.ts';
import videoDownloaderService from '../services/video-downloader.service.ts';
import { type IAuthRequest } from '../types/index.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import { ResponseHandler } from '../utils/response-handler.ts';
import HttpStatus from 'http-status';

class VideoDownloaderController {
  async createVideoDownload(req: IAuthRequest, res: Response): Promise<void> {
    const { url } = req.body;

    if (!url || typeof url !== 'string') {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Missing or invalid required field: url');
    }

    // Construct DTO according to `CreateVideoDownloadDto` type
    const dto: CreateVideoDownloadDto = {
      url,
      user_id: req?.user?.id as string,
    };

    const result = await videoDownloaderService.createVideoDownload(dto);

    ResponseHandler.success(res, result, 'Video download request created successfully', 201);
  }

  async getUserVideoDownloads(req: IAuthRequest, res: Response, next: NextFunction): Promise<void> {
    // Optional pagination
    const limit: number = req.query.limit ? parseInt(String(req.query.limit), 10) : 10;
    const offset: number = req.query.offset ? parseInt(String(req.query.offset), 10) : 0;

    const result = await videoDownloaderService.getUserVideoDownloads(req?.user?.id as string, {
      limit,
      offset,
    });

    ResponseHandler.success(res, result, 'User video downloads retrieved successfully');
  }
}

export default new VideoDownloaderController();
