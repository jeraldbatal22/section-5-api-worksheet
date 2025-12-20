import { Request, Response, NextFunction } from 'express';
import { ResponseHandler } from '../utils/response-handler.util';
import authService from '../services/auth.service';
import { I_AuthRequest } from '../models/user.model';

class AuthController {
  async register(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const result = await authService.register({ username, password });
    ResponseHandler.success(res, result, 'Successfully registered user');
  }

  async login(req: Request, res: Response): Promise<void> {
    const { username, password } = req.body;
    const result = await authService.login({ username, password });
    ResponseHandler.success(res, result, 'Successfully logged in');
  }

  async getUsers(_req: Request, res: Response, _next: NextFunction): Promise<void> {
    const users = await authService.getUsers();
    ResponseHandler.success(res, users, 'Successfully retrieved users');
  }

  async getMe(req: I_AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const user = await authService.findUser(String(req.user?.id));
    ResponseHandler.success(res, user, 'Successfully found user');
  }

  async getUser(req: I_AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const { id } = req.params;
    const user = await authService.findUser(id);
    ResponseHandler.success(res, user, 'Successfully found user');
  }
}

export default new AuthController();
