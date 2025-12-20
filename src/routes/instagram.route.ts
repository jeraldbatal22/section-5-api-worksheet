import { Router } from 'express';
import instagramPostController from '../controllers/instagram-post.controller';
import multer from 'multer';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createInstagramPostSchema, updateInstagramPostSchema } from '../schemas/instagram.schema';
const upload = multer(); // Uses memory storage by default

const instagramPostRouter = Router();

instagramPostRouter.post('/', upload.single('file'), validate(createInstagramPostSchema));
instagramPostRouter.put('/:id', upload.single('file'), validate(updateInstagramPostSchema));
instagramPostRouter.get('/', asyncHandler(instagramPostController.getAllPostsByUserId));
instagramPostRouter.delete('/:id', asyncHandler(instagramPostController.deletePostById));

export default instagramPostRouter;
