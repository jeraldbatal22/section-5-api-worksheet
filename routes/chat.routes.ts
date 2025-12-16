import { Router } from "express";
import chatController from "../controller/chat.controller.ts";
import multer from "multer";
import { asyncHandler } from "../middleware/async-handler.ts";

const chatRouter = Router();

const upload = multer(); // Uses memory storage by default

chatRouter.post(
  "/",
  upload.single("file"),
  asyncHandler(chatController.sendMessage)
);
chatRouter.get("/", asyncHandler(chatController.getMessagesByUserId));
chatRouter.get("/:id", asyncHandler(chatController.getMessageById));
chatRouter.delete("/:id", asyncHandler(chatController.deleteMessageById));

export default chatRouter;
