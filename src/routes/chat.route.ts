import { Router } from 'express';
import chatController from '../controllers/chat.controller';
import multer from 'multer';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { validate } from '../middlewares/validation.middleware';
import { sendMessageSchema } from '../schemas/chat.schema';

const chatRouter = Router();

const upload = multer(); // Uses memory storage by default

chatRouter.post(
  '/',
  upload.single('file'),
  validate(sendMessageSchema),
  asyncHandler(chatController.sendMessage)
);
chatRouter.get('/', asyncHandler(chatController.getMessagesByUserId));
chatRouter.get('/:id', asyncHandler(chatController.getMessageById));
chatRouter.delete(
  '/:id',
  authorizeRoles('basic', 'pro'),
  asyncHandler(chatController.deleteMessageById)
);

export default chatRouter;
