import type { Response, NextFunction } from "express";
import todoService from "../services/todo.service.ts";
import type { IAuthRequest } from "../types/index.ts";

class TodoController {
  async create(req: IAuthRequest, res: Response): Promise<void> {
    const { title, description } = req.body;
    const todo = await todoService.createTodo(req?.user?.id as any, {
      title,
      description,
    });

    res.status(201).json({
      success: true,
      data: todo || null,
      message: "Successfully Created Todo",
    });
  }

  async getAll(req: IAuthRequest, res: Response): Promise<void> {
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;
    const completed =
      req.query.completed === "true"
        ? true
        : req.query.completed === "false"
        ? false
        : undefined;

    const result = await todoService.getTodosByUser(
      req?.user?.id as any,
      limit,
      offset,
      completed
    );

    res.status(200).json({
      success: true,
      data: result || [],
      message: "Sucessfully Get All Todos",
    });
  }

  async getById(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;

    const todo = await todoService.getTodoById(id);

    res.status(200).json({
      success: true,
      data: todo || null,
      message: "Sucessfully Get Todo",
    });
  }

  async update(
    req: IAuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    const id = req.params.id;
    const { title, description, is_completed } = req.body;

    const todo = await todoService.updateTodo(id, req?.user?.id as any, {
      title,
      description,
      is_completed,
    });

    res.status(201).json({
      success: true,
      data: todo || null,
      message: "Successfully Updated Todo",
    });
  }

  async delete(req: IAuthRequest, res: Response): Promise<void> {
    const id = req.params.id;
    await todoService.deleteTodo(id, req?.user?.id as any);

    res.status(200).send({
      success: true,
      data: null,
      message: "Successfully Deleted Todo",
    });
  }
}

export default new TodoController();
