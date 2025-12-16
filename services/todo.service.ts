import todoRepository from "../repositories/todo.repository.ts";
import type { CreateTodoDTO, UpdateTodoDTO } from "../dto/todo.dto.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

class TodoService {
  private todoRepo: typeof todoRepository;

  constructor() {
    this.todoRepo = todoRepository;
  }

  async createTodo(userId: string, todoData: CreateTodoDTO) {
    return await this.todoRepo.create(userId, todoData);
  }

  async getTodoById(id: string) {
    const todo = await this.todoRepo.findByTodoId(id);
    if (!todo) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Todo not found");
    return todo;
  }

  async getTodoByIdAndUser(id: string, userId: string) {
    const todo = await this.todoRepo.findByIdAndUserId(id, userId);
    if (!todo) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Todo not found");
    return todo;
  }

  async getTodosByUser(
    userId: string,
    limit: number = 10,
    offset: number = 0,
    completed?: boolean
  ) {
    return await this.todoRepo.findAllByUserId(userId, limit, offset, completed);
  }

  async updateTodo(id: string, userId: string, todoData: UpdateTodoDTO) {
    const updated = await this.todoRepo.update(id, userId, todoData);
    if (!updated) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Todo not found or not updated");
    return updated;
  }

  async deleteTodo(id: string, userId: string) {
    const result = await this.todoRepo.delete(id, userId);
    if (!result) throw new ErrorResponse(HttpStatus.BAD_REQUEST, "Todo not found or not deleted");
    return true;
  }

  async countTodosByUser(userId: string, completed?: boolean) {
    return await this.todoRepo.countByUserId(userId, completed);
  }
}

export default new TodoService();