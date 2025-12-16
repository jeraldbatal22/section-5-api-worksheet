import { Router } from "express";
import shortenUrlController from "../controller/shorten-url.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

const shortenUrlRouter = Router();

shortenUrlRouter.post("/", asyncHandler(shortenUrlController.create));
shortenUrlRouter.get("/", asyncHandler(shortenUrlController.getAll));
shortenUrlRouter.get("/:shortCode", asyncHandler(shortenUrlController.getByShortCode));

export default shortenUrlRouter;
