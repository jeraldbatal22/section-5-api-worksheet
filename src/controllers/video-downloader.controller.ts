import { NextFunction, Response } from 'express';
import { CreateVideoDownloadDto } from '../models/video-downloader.model';
import videoDownloaderService from '../services/video-downloader.service';
import { AppError } from '../middlewares/error-handler.middleware';
import { ResponseHandler } from '../utils/response-handler.util';
import HttpStatus from 'http-status';
import { I_AuthRequest } from '../models/user.model';

class VideoDownloaderController {
  async createVideoDownload(req: I_AuthRequest, res: Response): Promise<void> {
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

  async getUserVideoDownloads(
    req: I_AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
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
