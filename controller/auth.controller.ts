import type { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

class AuthController {
  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await AuthService.register({ username, password });

      res.status(201).json({
        success: true,
        data: result,
        message: "Successfully registered user",
      });
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { username, password } = req.body;
      const result = await AuthService.login({ username, password });

      res.status(200).json({
        success: true,
        data: result,
        message: "Successfully logged in",
      });
    } catch (error) {
      next(error);
    }
  }

  async getUsers(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await AuthService.getUsers();
      res.status(200).json({
        success: true,
        data: users,
        message: "Successfully retrieved users",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new AuthController();
