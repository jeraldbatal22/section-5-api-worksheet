import { Router } from 'express';
import todoController from '../controllers/todo.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createTodoSchema, updateTodoSchema } from '../schemas/todo.schema';

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
