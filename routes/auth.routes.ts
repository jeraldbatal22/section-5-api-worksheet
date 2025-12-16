import { Router } from 'express';
import authController from '../controller/auth.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';

const authRouter = Router();

authRouter.post('/login', asyncHandler(authController.login));
authRouter.post('/register', asyncHandler(authController.register));
authRouter.post('/users', asyncHandler(authController.getUsers));

export default authRouter;