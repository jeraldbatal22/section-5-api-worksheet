import { Router } from "express";
import bookmarkController from "../controller/bookmark.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

const bookmarkRouter = Router();

bookmarkRouter.get("/", asyncHandler(bookmarkController.getAll));
bookmarkRouter.get("/:id", asyncHandler(bookmarkController.getById));
bookmarkRouter.post("/", asyncHandler(bookmarkController.create));
bookmarkRouter.put("/:id", asyncHandler(bookmarkController.update));
bookmarkRouter.delete("/:id", asyncHandler(bookmarkController.delete));

export default bookmarkRouter;
