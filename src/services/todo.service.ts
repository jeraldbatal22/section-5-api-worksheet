import todoRepository from '../repositories/todo.repository';
import { PaginationHelper } from '../utils/pagination.util';
import { T_CreateTodoInput, T_UpdateTodoInput } from '../schemas/todo.schema';
interface TodoListOptions {
  is_completed: boolean;
  pagination: { limit?: number; offset?: number; page?: number };
}
class TodoService {
  private todoRepo: typeof todoRepository;

  constructor() {
    this.todoRepo = todoRepository;
  }

  async createTodo(userId: string, todoData: T_CreateTodoInput) {
    return await this.todoRepo.create(userId, todoData);
  }

  async getTodoById(id: string) {
    const todo = await this.todoRepo.findByTodoId(id);
    return todo;
  }

  async getTodoByIdAndUser(id: string, userId: string) {
    const todo = await this.todoRepo.findByIdAndUserId(id, userId);
    return todo;
  }

  async getTodosByUser(userId: string, options: TodoListOptions) {
    const { limit, offset } = PaginationHelper.normalize(options.pagination);
    const totalCount = await this.todoRepo.getTotalCountTodos(userId);

    const todos = await this.todoRepo.findAllByUserId(userId, limit, offset, options.is_completed);
    return PaginationHelper.paginate(todos, totalCount, { limit, offset });
  }

  async updateTodo(id: string, userId: string, todoData: T_UpdateTodoInput) {
    const updated = await this.todoRepo.update(id, userId, todoData);
    return updated;
  }

  async deleteTodo(id: string, userId: string) {
    await this.todoRepo.delete(id, userId);
    return true;
  }

  async countTodosByUser(userId: string, completed?: boolean) {
    return await this.todoRepo.countByUserId(userId, completed);
  }
}

export default new TodoService();
