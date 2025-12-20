import { Response, NextFunction } from 'express';
import InstagramPostService from '../services/instagram-post.service';
import { AppError } from '../middlewares/error-handler.middleware';
import { ResponseHandler } from '../utils/response-handler.util';
import HttpStatus from 'http-status';
import { I_AuthRequest } from '../models/user.model';

class InstagramPostController {
  async createPost(req: I_AuthRequest, res: Response, next: NextFunction) {
    // Multer puts the file in req.file (single uploads)
    const file = req.file;

    const { caption, uploadTo } = req.body;

    const created = await InstagramPostService.createPost({
      user_id: String(req.user?.id),
      caption,
      file,
      uploadTo,
    });

    ResponseHandler.success(res, created || null, 'Successfully Created Post', 201);
  }

  async updatePost(req: I_AuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;
    const { caption } = req.body;

    // Find existing post to get old file url (if any)
    const existingPost = await InstagramPostService.getPostByIdAndUserId(
      postId,
      req.user?.id as number
    );

    if (!existingPost) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Post not found or not owned by user');
    }

    const updated = await InstagramPostService.updatePost(postId, String(req.user?.id), {
      caption,
      file: req.file,
    });

    ResponseHandler.success(res, updated || null, 'Successfully Updated Post');
  }

  async getAllPostsByUserId(req: I_AuthRequest, res: Response, next: NextFunction) {
    if (!req.user) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }
    const posts = await InstagramPostService.getAllPostsByUserId(req.user.id);
    ResponseHandler.success(res, posts || null, 'Successfully Retrieved Posts');
  }

  async deletePostById(req: I_AuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;

    const post = await InstagramPostService.getPostByIdAndUserId(postId, req?.user?.id as string);
    if (!post) {
      throw new AppError(HttpStatus.NOT_FOUND, 'Post not found or not owned by user');
    }

    await InstagramPostService.deletePostById(postId, req?.user?.id as string);
    ResponseHandler.success(res, null, 'Successfully Deleted Post');
  }
}

export default new InstagramPostController();
