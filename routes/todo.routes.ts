import { Router } from 'express';
import todoController from '../controller/todo.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { authorizeRoles } from '../middleware/authorize-roles.middleware.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema.ts';

const todoRouter = Router();

todoRouter.get('/', authorizeRoles('basic', 'pro'), asyncHandler(todoController.getAll));
todoRouter.get('/:id', authorizeRoles('basic', 'pro'), asyncHandler(todoController.getById));
todoRouter.post(
  '/',
  validate(createTodoSchema),
  authorizeRoles('basic', 'pro'),
  asyncHandler(todoController.create)
);
todoRouter.put(
  '/:id',
  validate(updateTodoSchema),
  authorizeRoles('pro'),
  asyncHandler(todoController.update)
);
todoRouter.delete('/:id', authorizeRoles('pro'), asyncHandler(todoController.delete));

export default todoRouter;
