import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';
import { AWS, SUPABASE } from '../config/env.config';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from "http-status";

export interface UploadOptions {
  // entityType: FileEntityType;
  entityType: any;
  entityId: string;
  userId: string;
  folder?: string;
  expiresIn?: number;
}

export interface UploadResult {
  key: string;
  url: string;
  metadata: {
    name: string;
    type: string;
    size: number;
  };
}

class UploadService {
  private s3Client: S3Client;
  private bucketName: string;
  private supabase: SupabaseClient;

  constructor() {
    this.s3Client = new S3Client({
      region: AWS.REGION,
      credentials: {
        accessKeyId: AWS.ACCESS_KEY_ID,
        secretAccessKey: AWS.SECRET_ACCESS_KEY,
      },
    });
    this.bucketName = AWS.S3_BUCKET_NAME;
    this.supabase = createClient(
      SUPABASE.URL,
      SUPABASE.SERVICE_KEY // Use service key for backend operations
    );
  }

  async uploadFileToAwsS3(file: any, options: UploadOptions): Promise<UploadResult> {
    const { entityType, entityId, userId, folder, expiresIn = 7 * 24 * 60 * 60 } = options;

    // Add error throwing with AppError as per instruction
    if (typeof file.originalname !== "string") {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid file: originalname must be a string");
    }

    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${uuidv4()}.${fileExtension}`;
    const basePath = folder || entityType;
    const key = `${basePath}/${userId}/${fileName}`;
    
    const command = new PutObjectCommand({
      Bucket: this.bucketName,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        originalName: file.originalname,
        uploadedBy: userId,
        entityType: entityType,
        entityId: entityId,
      },
    });

    await this.s3Client.send(command);
    const url = await this.getSignedUrl(key, expiresIn);

    return {
      key,
      url,
      metadata: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      },
    };
  }

  /**
   * Upload a file to Supabase Storage (bucket: chat-files)
   * @param file - Express.Multer.File
   * @param options - UploadOptions (expects entityType, entityId, userId, etc.)
   * @returns {Promise<UploadResult>} - Uploaded file metadata and public URL
   */
  async uploadFileToSupabase(file: any, options: UploadOptions): Promise<UploadResult> {
    const { entityType, entityId, userId, folder } = options;

    // Add error throwing with AppError as per instruction
    if (typeof file.originalname !== "string") {
      throw new AppError(HttpStatus.BAD_REQUEST, "Invalid file: originalname must be a string");
    }

    // Compose file name and bucket path
    const fileExtension = file.originalname.split('.').pop();
    const fileName = `${userId}-${entityId}-${Date.now()}.${fileExtension}`;
    const basePath = folder || entityType || "chats";
    const filePath = `${basePath}/${fileName}`; // e.g., chats/uuid-uuid-timestamp.jpg

    // Upload file buffer to 'chat-files' bucket
    const { error } = await this.supabase
      .storage
      .from('chat-files')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        cacheControl: '3600',
        upsert: false // do not overwrite
      });

    if (error) {
      throw new AppError(HttpStatus.BAD_REQUEST, `Failed to upload file to Supabase: ${error.message}`);
    }

    // Get public URL
    const { data } = this.supabase
      .storage
      .from('chat-files')
      .getPublicUrl(filePath);

    const url = data.publicUrl;

    return {
      key: filePath,
      url,
      metadata: {
        name: file.originalname,
        type: file.mimetype,
        size: file.size,
      },
    };
  }

  async getSignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    return await getSignedUrl(this.s3Client, command, { expiresIn });
  }

  async deleteFile(key: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucketName,
      Key: key,
    });
    await this.s3Client.send(command);
  }
}

export default new UploadService();
