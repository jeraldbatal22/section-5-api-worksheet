import type { Request, Response, NextFunction } from "express";
import { SUPABASE } from "../config/env.ts"; // Assumes you have these
import userRepository from "../repositories/user.repository.ts";
import jwt, { type JwtPayload } from "jsonwebtoken";
import supabase from "../utils/supabase/server.ts";
import type { IAuthUser } from "../types/index.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

interface AuthRequest extends Request {
  user?: any;
}

const authorizeMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "Unauthorized");
    }

    const decoded = jwt.verify(token, SUPABASE.SECRET_KEY);

    if (decoded) {
      const { data, error } = await supabase.auth.getUser(token);

      if (error || !data?.user) {
        throw new ErrorResponse(
          HttpStatus.UNAUTHORIZED,
          "Invalid Supabase token"
        );
      }

      const user = await userRepository.findById(decoded.sub as string);

      if (!user) {
        throw new ErrorResponse(
          HttpStatus.UNAUTHORIZED,
          "Unauthorized - user not found"
        );
      }

      req.user = {
        ...(decoded as JwtPayload),
        role: user.role,
        id: decoded.sub,
      } as IAuthUser;

      next();
    }
  } catch (error) {
    next(error);
  }
};

/**
 * Middleware to check if user has required role(s)
 * @param {string[]} allowedRoles - Array of allowed roles (e.g., ['admin'], ['admin', 'doctor'])
 * @returns {Function} Express middleware function
 */
export const authorizeRoles =
  (...allowedRoles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized - Authentication required",
        statusCode: 401,
        error: true,
      });
      return;
    }
    // You may need to adjust user role logic here depending on your user model or Supabase metadata
    const userRole =
      req.user.role || req.user?.supabaseUser?.user_metadata?.role;
    if (!allowedRoles.includes(userRole)) {
      res.status(403).json({
        message:
          "Forbidden - You do not have permission to access this resource",
        statusCode: 403,
        error: true,
      });
      return;
    }

    next();
  };

export default authorizeMiddleware;
