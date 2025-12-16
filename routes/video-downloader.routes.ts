// src/routes/video-downloader.routes.ts
import { Router } from "express";
import { body } from "express-validator";
import videoDownloaderController from "../controller/video-downloader.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

const videoDownloaderRouter = Router();

videoDownloaderRouter.post(
  "/download",
  [
    body("url")
      .notEmpty()
      .withMessage("URL is required")
      .isURL()
      .withMessage("Must be a valid URL"),
  ],
  asyncHandler(videoDownloaderController.createVideoDownload)
);

videoDownloaderRouter.get("/", asyncHandler(videoDownloaderController.getUserVideoDownloads));

export default videoDownloaderRouter;
