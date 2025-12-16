import { SupabaseClient } from "@supabase/supabase-js";
import type { CreateTodoDTO, UpdateTodoDTO, Todo } from "../dto/todo.dto.ts";
import supabase from "../utils/supabase/server.ts";

export class TodoRepository {
  private supabase: SupabaseClient;
  private tableName = "todos";

  constructor() {
    this.supabase = supabase;
  }

  // Create a new todo
  async create(userId: string, todoData: CreateTodoDTO): Promise<Todo> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId,
        title: todoData.title,
        description: todoData.description ?? null,
        is_completed: false,
      })
      .select("*")
      .single();
    if (error) throw new Error(`Database error: ${error.message}`);
    return data as Todo;
  }

  // Find todo by ID
  async findByTodoId(id: string): Promise<Todo | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return data as Todo;
  }

  // Find todo by ID and user ID
  async findByIdAndUserId(id: string, userId: string): Promise<Todo | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();
    if (error || !data) return null;
    return data as Todo;
  }

  // Get all todos for a user
  async findAllByUserId(
    userId: string,
    limit: number = 10,
    offset: number = 0,
    completed?: boolean
  ): Promise<Todo[]> {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (completed !== undefined) {
      query = query.eq("is_completed", completed);
    }

    const { data, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data as Todo[]) ?? [];
  }

  // Update todo
  async update(
    id: string,
    userId: string,
    todoData: UpdateTodoDTO
  ): Promise<Todo | null> {
    if (
      todoData.title === undefined &&
      todoData.description === undefined &&
      todoData.is_completed === undefined
    ) {
      throw new Error("No fields to update");
    }

    const updateObj: Record<string, any> = {};
    if (todoData.title !== undefined) updateObj.title = todoData.title;
    if (todoData.description !== undefined)
      updateObj.description = todoData.description;
    if (todoData.is_completed !== undefined)
      updateObj.is_completed = todoData.is_completed;

    updateObj.updated_at = new Date().toISOString();

    const { data, error } = await this.supabase
      .from(this.tableName)
      .update(updateObj)
      .eq("id", id)
      .eq("user_id", userId)
      .select("*")
      .single();
    if (error || !data) return null;
    return data as Todo;
  }

  // Delete todo
  async delete(id: string, userId: string): Promise<boolean> {
    const { error, data } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq("id", id)
      .eq("user_id", userId)
      .select("id")
      .maybeSingle();
    if (error) return false;
    return !!data;
  }

  // Count todos for a user
  async countByUserId(userId: string, completed?: boolean): Promise<number> {
    let query = this.supabase
      .from(this.tableName)
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (completed !== undefined) {
      query = query.eq("is_completed", completed);
    }

    const { count, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return count || 0;
  }
}

export default new TodoRepository();
