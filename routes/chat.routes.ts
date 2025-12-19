import { Router } from 'express';
import chatController from '../controller/chat.controller.ts';
import multer from 'multer';
import { asyncHandler } from '../middleware/async-handler.ts';
import { authorizeRoles } from '../middleware/authorize-roles.middleware.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { sendMessageSchema } from '../schemas/chat.schema.ts';

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
