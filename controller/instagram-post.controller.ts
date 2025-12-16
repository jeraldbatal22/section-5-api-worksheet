import type { Response, NextFunction } from "express";
import InstagramPostService from "../services/instagram-post.service.ts";
import type { IAuthRequest } from "../types/index.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

class InstagramPostController {
  async createPost(req: IAuthRequest, res: Response, next: NextFunction) {
    // Multer puts the file in req.file (single uploads)
    const file = req.file;

    const { caption, uploadTo } = req.body;

    const created = await InstagramPostService.createPost({
      user_id: String(req.user?.id),
      caption,
      file,
      uploadTo,
    });

    res.status(201).json({
      success: true,
      data: created || null,
      message: "Successfully Created Post",
    });
  }

  async updatePost(req: IAuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;
    const { caption } = req.body;

    // Find existing post to get old file url (if any)
    const existingPost = await InstagramPostService.getPostByIdAndUserId(
      postId,
      req.user?.id as number
    );

    if (!existingPost) {
      throw new ErrorResponse(
        HttpStatus.NOT_FOUND,
        "Post not found or not owned by user"
      );
    }

    const updated = await InstagramPostService.updatePost(
      postId,
      String(req.user?.id),
      {
        caption,
        file: req.file,
      }
    );

    res.status(200).json({
      success: true,
      data: updated || null,
      message: "Successfully Updated Post",
    });
  }

  async getAllPostsByUserId(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ) {
    if (!req.user) {
      throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }
    const posts = await InstagramPostService.getAllPostsByUserId(req.user.id);
    res.status(200).json({
      success: true,
      data: posts || null,
      message: "Successfully Retrieved Posts",
    });
  }

  async deletePostById(req: IAuthRequest, res: Response, next: NextFunction) {
    const postId = req.params.id;

    const post = await InstagramPostService.getPostByIdAndUserId(
      postId,
      req?.user?.id as string
    );
    if (!post) {
      throw new ErrorResponse(
        HttpStatus.NOT_FOUND,
        "Post not found or not owned by user"
      );
    }

    await InstagramPostService.deletePostById(postId, req?.user?.id as string);
    res.status(200).json({
      success: true,
      data: null,
      message: "Successfully Deleted Post",
    });
  }
}

export default new InstagramPostController();
