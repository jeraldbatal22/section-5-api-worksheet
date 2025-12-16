import { SupabaseClient } from "@supabase/supabase-js";
import { UserModel, type IUser } from "../model/user.model.ts";
import supabase from "../utils/supabase/server.ts";

export class UserRepository {
  private supabase: SupabaseClient;
  private tableName = "users";

  constructor() {
    this.supabase = supabase;
  }

  // Sign up a user with Supabase Auth
  async signupWithPassword(
    email: string,
    password: string,
    additionalData?: { [key: string]: any }
  ) {
    const { data, error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        data: additionalData,
      },
    });

    if (error) throw new Error(`Supabase signup error: ${error.message}`);
    console.log(data);
    this.create({ username: data?.user?.email, id: data.user?.id });

    return data;
  }

  // Sign in a user with Supabase Auth
  async signin(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw new Error(`Supabase signin error: ${error.message}`);
    return data;
  }

  // Create a new user
  async create(userData: any): Promise<UserModel> {
    // const hashedPassword = await this.hashPassword(userData.password);

    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        email: userData.username,
        // password: hashedPassword,
        avatar_url: userData.avatar_url ?? null,
        role: userData.role ?? "user",
      })
      .select("*")
      .single();
    if (error) throw new Error(`Database error: ${error.message}`);
    return new UserModel(data as IUser);
  }

  // Find a user by their ID
  async findById(id: string | number): Promise<UserModel | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("id", id)
      .single();
    if (error || !data) return null;
    return new UserModel(data as IUser);
  }

  // Retrieve all users from the table
  async findAllUsers(): Promise<UserModel[]> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*");

    if (error) throw new Error(`Database error: ${error.message}`);
    if (!data) return [];

    return data.map((user: IUser) => new UserModel(user));
  }
}

export default new UserRepository();
