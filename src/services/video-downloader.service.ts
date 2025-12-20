import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { CreateVideoDownloadDto } from '../models/video-downloader.model';
import videoDownloadRepo from '../repositories/video-download.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';

interface VideoQueryOptions {
  limit?: number;
  offset?: number;
}

class VideoDownloaderService {
  private uploadDir: string;

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || './uploads/video-downloader';
    this.ensureUploadDirectoryExists();
  }

  // Ensure the upload directory exists
  private ensureUploadDirectoryExists(): void {
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
  }

  // Validate a video URL (accepts http/https protocols)
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return ['http:', 'https:'].includes(urlObj.protocol);
    } catch {
      return false;
    }
  }

  // Generate a unique video filename for storage
  private generateFilename(url: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    const extension = path.extname(new URL(url).pathname) || '.mp4';
    return `video_${timestamp}_${random}${extension}`;
  }

  // Create a new video download request, start downloading in background
  async createVideoDownload(dto: CreateVideoDownloadDto): Promise<any> {
    if (!this.isValidUrl(dto.url)) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid URL format');
    }
    const data = await videoDownloadRepo.create(dto as any);

    this.downloadVideo(data.id, dto.url, dto.user_id).catch(error => {
      console.error(`Download failed for video ${data.id}:`, error.message);
    });

    return data;
  }

  // Download video file and track status in repo
  private async downloadVideo(id: number, url: string, user_id: number | string): Promise<void> {
    let filePath: string | null = null;
    try {
      await videoDownloadRepo.update(id, { status: 'downloading' });

      const filename = this.generateFilename(url);
      filePath = path.join(this.uploadDir, user_id.toString(), filename);
      fs.mkdirSync(path.dirname(filePath), { recursive: true });

      const response = await axios({
        method: 'GET',
        url,
        responseType: 'stream',
        timeout: 300000,
        maxContentLength: 500 * 1024 * 1024,
      });

      const writer = fs.createWriteStream(filePath);
      response.data.pipe(writer);

      await new Promise<void>((resolve, reject) => {
        writer.on('finish', resolve);
        writer.on('error', reject);
      });

      const stats = fs.statSync(filePath);
      const fileSize = stats.size;

      await videoDownloadRepo.update(id, {
        status: 'completed',
        file_path: filePath,
        file_size: fileSize,
      });

      console.log(`✅ Video ${id} downloaded successfully`);
    } catch (error: any) {
      if (filePath && fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      await videoDownloadRepo.update(id, {
        status: 'failed',
        error_message: error?.message || 'Download failed',
      });
      console.error(`❌ Video ${id} download failed:`, error?.message);
      throw error;
    }
  }

  // Get all video downloads for a user, paginated
  async getUserVideoDownloads(
    userId: number | string,
    options: VideoQueryOptions = {}
  ): Promise<any[]> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;
    if (limit < 1 || limit > 100)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid limit (must be between 1 and 100)');
    if (offset < 0)
      throw new AppError(HttpStatus.BAD_REQUEST, 'Invalid offset (must be 0 or greater)');

    return await videoDownloadRepo.findByUserId(userId, limit, offset);
  }
}

export default new VideoDownloaderService();
