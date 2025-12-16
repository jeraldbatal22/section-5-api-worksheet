import { Router } from "express";
import todoController from "../controller/todo.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

const todoRouter = Router();

todoRouter.get("/", asyncHandler(todoController.getAll));
todoRouter.get("/:id", asyncHandler(todoController.getById));
todoRouter.post("/", asyncHandler(todoController.create));
todoRouter.put("/:id", asyncHandler(todoController.update));
todoRouter.delete("/:id", asyncHandler(todoController.delete));

export default todoRouter;
