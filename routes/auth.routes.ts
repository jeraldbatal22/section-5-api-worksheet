import { Router } from 'express';
import authController from '../controller/auth.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
// import { userValidationSchemas } from '../validation/user.validation.ts';
import { validate } from '../middleware/validation.middleware.ts';
import authorizeMiddleware from '../middleware/auth.middleware.ts';
import { loginSchema, registerSchema } from '../schemas/user.schema.ts';

const authRouter = Router();

authRouter.post('/login', validate(loginSchema), asyncHandler(authController.login));
authRouter.post('/register', validate(registerSchema), asyncHandler(authController.register));
authRouter.post('/users', asyncHandler(authController.getUsers));
authRouter.get('/me', authorizeMiddleware, asyncHandler(authController.getMe));
authRouter.get('/users/:id', authorizeMiddleware, asyncHandler(authController.getMe));

export default authRouter;
