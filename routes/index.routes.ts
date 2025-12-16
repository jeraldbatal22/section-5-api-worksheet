import { Router, type Request, type Response, type NextFunction } from "express";
import todoRouter from "./todo.routes.ts";
import calculatorRouter from "./calculator.routes.ts";
import shortenUrlRouter from "./shorten-url.routes.ts";
import pokemonRouter from "./pokemon.routes.ts";
import currencyConvertRouter from "./currency-converter.routes.ts";
import bookmarkRouter from "./bookmark.routes.ts";
import videoDownloaderRouter from "./video-downloader.routes.ts";
import chatRouter from "./chat.routes.ts";
import authRouter from "./auth.routes.ts";
import authorizeMiddleware from "../middleware/auth.middleware.ts";
import instagramPostRouter from "./instagram.routes.ts";
import publicRouter from "./public.routes.ts";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { SUPABASE } from "../config/env.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

const router = Router();

router.use("/api/v1/auth", authRouter);
router.get("/api/v1/protected", authorizeMiddleware, (req, res) => {
  res.send("Hello to protected routes");
});
router.use("/api/v1/todos", authorizeMiddleware, todoRouter);
router.use("/api/v1/calculator", authorizeMiddleware, calculatorRouter);
router.use("/api/v1/shorten-url", authorizeMiddleware, shortenUrlRouter);
router.use("/api/v1/currency-convert", authorizeMiddleware, currencyConvertRouter);
router.use("/api/v1/bookmarks", authorizeMiddleware, bookmarkRouter);
router.use("/api/v1/video-downloader", authorizeMiddleware, videoDownloaderRouter);
router.use("/api/v1/chats", authorizeMiddleware, chatRouter);
router.use("/api/v1/instagram/posts", authorizeMiddleware, instagramPostRouter);

router.use("/api/v1/pokemons", pokemonRouter);
router.use("/api/v1/public", publicRouter);

router.get(
  "/session/status",
  authorizeMiddleware,
  (req: Request, res: Response, next: NextFunction) => {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "No token provided");
      }
      const token = authHeader.substring(7);
      const decoded = jwt.verify(
        token,
        SUPABASE.SECRET_KEY! as string
      ) as JwtPayload;

      if (!decoded || !decoded.exp) {
        throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "Invalid token");
      }

      const now = Math.floor(Date.now() / 1000);
      const timeLeft = decoded.exp - now;
      if (timeLeft <= 0) {
        throw new ErrorResponse(HttpStatus.UNAUTHORIZED, "Token expired");
      }
      res.json({
        message: "Session is valid",
        expiresIn: `${timeLeft} seconds`,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
