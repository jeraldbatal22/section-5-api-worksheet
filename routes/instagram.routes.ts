import { Router } from 'express';
import instagramPostController from '../controller/instagram-post.controller.ts';
import multer from 'multer';
import { asyncHandler } from '../middleware/async-handler.ts';
import { validate } from '../middleware/validation.middleware.ts';
import {
  createInstagramPostSchema,
  updateInstagramPostSchema,
} from '../schemas/instagram.schema.ts';
const upload = multer(); // Uses memory storage by default

const instagramPostRouter = Router();

instagramPostRouter.post('/', upload.single('file'), validate(createInstagramPostSchema));
instagramPostRouter.put('/:id', upload.single('file'), validate(updateInstagramPostSchema));
instagramPostRouter.get('/', asyncHandler(instagramPostController.getAllPostsByUserId));
instagramPostRouter.delete('/:id', asyncHandler(instagramPostController.deletePostById));

export default instagramPostRouter;
