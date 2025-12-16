import { Router } from "express";
import instagramPostController from "../controller/instagram-post.controller.ts";
import multer from "multer";
import { asyncHandler } from "../middleware/async-handler.ts";
const upload = multer(); // Uses memory storage by default

const instagramPostRouter = Router();

instagramPostRouter.post(
  "/",
  upload.single("file"),
  asyncHandler(instagramPostController.createPost)
);
instagramPostRouter.put(
  "/:id",
  upload.single("file"),
  asyncHandler(instagramPostController.updatePost)
);
instagramPostRouter.get(
  "/",
  asyncHandler(instagramPostController.getAllPostsByUserId)
);
instagramPostRouter.delete(
  "/:id",
  asyncHandler(instagramPostController.deletePostById)
);

export default instagramPostRouter;
