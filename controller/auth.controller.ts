import type { Request, Response, NextFunction } from 'express';
import AuthService from '../services/auth.service.ts';
import { ResponseHandler } from '../utils/response-handler.ts';
import type { IAuthRequest } from '../types/index.ts';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const result = await AuthService.register({ username, password });
    ResponseHandler.success(res, result, 'Successfully registered user');
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const result = await AuthService.login({ username, password });
    ResponseHandler.success(res, result, 'Successfully logged in');
  }

  async getUsers(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const users = await AuthService.getUsers();
    ResponseHandler.success(res, users, 'Successfully retrieved users');
  }

  async getMe(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const user = await AuthService.findUser(String(req.user?.id));
    ResponseHandler.success(res, user, 'Successfully found user');
  }

  async getUser(req: IAuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const { id } = req.params;
    const user = await AuthService.findUser(id);
    ResponseHandler.success(res, user, 'Successfully found user');
  }
}

export default new AuthController();
