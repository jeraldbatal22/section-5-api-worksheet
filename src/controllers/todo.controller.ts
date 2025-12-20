import { Response, NextFunction } from 'express';
import todoService from '../services/todo.service';
import { I_AuthRequest } from '../models/user.model';
import { ResponseHandler } from '../utils/response-handler.util';

class TodoController {
  async create(req: I_AuthRequest, res: Response): Promise<void> {
    const { title, description } = req.body;
    const todo = await todoService.createTodo(req?.user?.id as any, {
      title,
      description,
      is_completed: false,
    });

    ResponseHandler.success(res, todo || null, 'Successfully Created Todo', 201);
  }

  async getAll(req: I_AuthRequest, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const page = parseInt(req.query.page as string);

    const is_completed =
      req.query.is_completed === 'true'
        ? true
        : req.query.is_completed === 'false'
          ? false
          : undefined;

    const result = await todoService.getTodosByUser(req?.user?.id as any, {
      is_completed: Boolean(is_completed),
      pagination: {
        limit,
        offset,
        page,
      },
    });

    ResponseHandler.success(res, result.data || [], 'Sucessfully Get Todos');
  }

  async getById(req: I_AuthRequest, res: Response): Promise<void> {
    const id = req.params.id;

    const todo = await todoService.getTodoById(id);

    ResponseHandler.success(res, todo || null, 'Sucessfully Get Todo');
  }

  async update(req: I_AuthRequest, res: Response, _next: NextFunction): Promise<void> {
    const id = req.params.id;
    const { title, description, is_completed } = req.body;

    const todo = await todoService.updateTodo(id, req?.user?.id as any, {
      title,
      description,
      is_completed,
    });

    ResponseHandler.success(res, todo || null, 'Successfully Updated Todo', 200);
  }

  async delete(req: I_AuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    await todoService.deleteTodo(id, req?.user?.id as any);

    ResponseHandler.success(res, null, 'Successfully Deleted Todo');
  }
}

export default new TodoController();
