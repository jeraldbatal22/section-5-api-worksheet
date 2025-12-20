import { Router } from 'express';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { validate } from '../middlewares/validation.middleware';
import { loginSchema, registerSchema } from '../schemas/user.schema';
import authController from '../controllers/auth.controller';
import authorizeMiddleware from '../middlewares/auth.middleware';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), asyncHandler(authController.login));
authRouter.post('/register', validate(registerSchema), asyncHandler(authController.register));
authRouter.post('/users', asyncHandler(authController.getUsers));
authRouter.get('/me', authorizeMiddleware, asyncHandler(authController.getMe));
authRouter.get('/users/:id', authorizeMiddleware, asyncHandler(authController.getMe));

export default authRouter;
