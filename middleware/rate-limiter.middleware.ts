import rateLimit from 'express-rate-limit';
import { RATE_LIMITER } from '../config/env.config.ts';

// Factory function to create a rate limiter middleware with dynamic config
const createRateLimiter = ({
  windowMs = Number(RATE_LIMITER.WINDOW_MS) * 60 * 1000, // 1 minute in milliseconds (total time window)
  max = Number(RATE_LIMITER.MAX_REQUESTS) + 1000, // total number of requests allowed per window
  message = 'Too many requests, please try again later.',
}) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      status: 'error',
      message,
      code: 429,
    },
    headers: true,
  });
};

export default createRateLimiter;
