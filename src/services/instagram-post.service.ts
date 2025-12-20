import { FileEntityType } from '../models/file.model';
import { v4 as uuidv4 } from 'uuid';
import uploadService from './upload.service';
import instagramRepository from '../repositories/instagram.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';
import {
  T_CreateInstagramPost,
  T_InstagramPost,
  T_UpdateInstagramPost,
} from '../schemas/instagram.schema';

class InstagramPostService {
  private postRepo: typeof instagramRepository;
  private uploadService: typeof uploadService;

  constructor() {
    this.postRepo = instagramRepository;
    this.uploadService = uploadService;
  }

  async createPost(data: T_CreateInstagramPost & { file?: any }): Promise<T_InstagramPost> {
    let fileUrl: string | undefined;
    let mediaType: string | undefined;
    let postId = uuidv4();

    if (data.file) {
      if (data.uploadTo === 'aws-s3') {
        const uploadResult = await this.uploadService.uploadFileToAwsS3(data.file, {
          entityType: FileEntityType.INSTAGRAM_POST,
          entityId: postId,
          userId: String(data.user_id),
        });
        console.log(uploadResult);
        fileUrl = uploadResult.url;
        mediaType = uploadResult.metadata.type.split('/')[0];
      }
      if (data.uploadTo === 'supabase-storage') {
        const uploadResult = await this.uploadService.uploadFileToSupabase(data.file, {
          entityType: FileEntityType.CHAT,
          entityId: postId,
          userId: String(data.user_id),
        });
        mediaType = uploadResult.metadata.type.split('/')[0];
        fileUrl = uploadResult.url;
      }
    }

    const postToSave = {
      user_id: data.user_id,
      url: fileUrl,
      caption: data.caption?.trim() || null,
      media_type: mediaType,
    };

    return await this.postRepo.createPost(postToSave);
  }

  async updatePost(
    postId: number | string,
    userId: number | string,
    update: T_UpdateInstagramPost & { file?: any }
  ): Promise<T_InstagramPost> {
    let newFileUrl: string | undefined;
    let mediaType: string | undefined;

    if (update.file) {
      const uploadResult = await this.uploadService.uploadFileToAwsS3(update.file, {
        entityType: FileEntityType.INSTAGRAM_POST,
        entityId: String(postId),
        userId: String(userId),
      });
      newFileUrl = uploadResult.url;
      mediaType = uploadResult.metadata.type.split('/')[0];
    }

    const mergedUpdate = {
      caption: update.caption,
      url: newFileUrl,
      media_type: mediaType,
    };

    const result = await this.postRepo.updatePost(postId, userId, mergedUpdate);

    if (!result) throw new AppError(HttpStatus.BAD_REQUEST, 'Post not found or not updated');
    return result;
  }

  async getPostByIdAndUserId(
    postId: number | string,
    userId: number | string
  ): Promise<T_InstagramPost | null> {
    if (!postId || !userId)
      throw new AppError(HttpStatus.NOT_FOUND, 'Post ID and User ID are required');
    const post = await this.postRepo.getPostByIdAndUserId(postId, userId);
    if (!post) return null;
    return post;
  }

  async getAllPostsByUserId(userId: number | string): Promise<T_InstagramPost[]> {
    if (!userId) throw new AppError(HttpStatus.BAD_REQUEST, 'User ID is required');
    return await this.postRepo.getAllPostsByUserId(userId);
  }

  async deletePostById(postId: number | string, userId: number | string): Promise<void> {
    const deleted = await this.postRepo.deletePostById(postId, userId);
    if (!deleted) throw new AppError(HttpStatus.BAD_REQUEST, 'Post not found or not deleted');
  }
}

export default new InstagramPostService();
