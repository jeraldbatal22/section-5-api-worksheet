import type { NextFunction, Response } from "express";
import type { CreateVideoDownloadDto } from "../model/video-downloader.model.ts";
import videoDownloaderService from "../services/video-downloader.service.ts";
import { type IAuthRequest } from "../types/index.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

class VideoDownloaderController {
  async createVideoDownload(req: IAuthRequest, res: Response): Promise<void> {
    const { url } = req.body;

    if (!url || typeof url !== "string") {
      throw new ErrorResponse(
        HttpStatus.BAD_REQUEST,
        "Missing or invalid required field: url"
      );
    }

    // Construct DTO according to `CreateVideoDownloadDto` type
    const dto: CreateVideoDownloadDto = {
      url,
      user_id: req?.user?.id as string,
    };

    const result = await videoDownloaderService.createVideoDownload(dto);

    res.status(201).json({
      success: true,
      message: "Video download request created successfully",
      data: result,
    });
  }

  async getUserVideoDownloads(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    // Optional pagination
    const limit: number = req.query.limit
      ? parseInt(String(req.query.limit), 10)
      : 10;
    const offset: number = req.query.offset
      ? parseInt(String(req.query.offset), 10)
      : 0;

    const result = await videoDownloaderService.getUserVideoDownloads(
      req?.user?.id as string,
      { limit, offset }
    );

    res.status(200).json({
      success: true,
      message: "User video downloads retrieved successfully",
      data: result,
    });
  }
}

export default new VideoDownloaderController();
