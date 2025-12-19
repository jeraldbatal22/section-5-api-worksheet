import type { Response, NextFunction } from 'express';
import { SUPABASE } from '../config/env.config.ts'; // Assumes you have these
import userRepository from '../repositories/user.repository.ts';
import jwt, { type JwtPayload } from 'jsonwebtoken';
import type { IAuthRequest, IAuthUser } from '../types/index.ts';
import HttpStatus from 'http-status';
import { getSupabaseDatabase } from '../config/supabase.config.ts';
import { AppError } from './error-handler.middleware.ts';

const authorizeMiddleware = async (
  req: IAuthRequest,
  _res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    let token: string | undefined;
    const supabase = getSupabaseDatabase();
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'No Token Provided');
    }

    const { error } = await supabase.auth.getUser(token);

    if (error) {
      throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized');
    }

    const decoded = jwt.verify(token, SUPABASE.SECRET_KEY);

    if (decoded) {
      const user = await userRepository.findById(decoded.sub as string);

      if (!user) {
        throw new AppError(HttpStatus.UNAUTHORIZED, 'Unauthorized - user not found');
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

export default authorizeMiddleware;
