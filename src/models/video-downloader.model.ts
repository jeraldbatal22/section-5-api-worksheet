export interface I_VideoDownload {
  id: number;
  user_id: number | string;
  url: string;
  file_path?: string;
  file_size?: number;
  error_message?: string;
  created_at: string; // ISO date string to match with other models
  updated_at: string;
}

export class VideoDownloadModel implements I_VideoDownload {
  id: number;
  user_id: number | string;
  url: string;
  file_path?: string;
  file_size?: number;
  error_message?: string;
  created_at: string;
  updated_at: string;

  constructor(data: I_VideoDownload) {
    this.id = data.id;
    this.user_id = data.user_id;
    this.url = data.url;
    this.file_path = data.file_path;
    this.file_size = data.file_size;
    this.error_message = data.error_message;
    this.created_at = data.created_at;
    this.updated_at = data.updated_at;
  }

  static from(data: any): VideoDownloadModel {
    return new VideoDownloadModel({
      id: data.id,
      user_id: data.user_id,
      url: data.url,
      file_path: data.file_path,
      file_size: data.file_size,
      error_message: data.error_message,
      created_at: data.created_at,
      updated_at: data.updated_at,
    });
  }
}

export type VideoDownloadStatus = 'pending' | 'downloading' | 'completed' | 'failed';

export interface CreateVideoDownloadDto {
  url: string;
  user_id: number | string;
}

export interface UpdateVideoDownloadDto {
  status?: VideoDownloadStatus;
  file_path?: string;
  file_size?: number;
  error_message?: string;
}
