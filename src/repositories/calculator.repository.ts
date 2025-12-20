import { SupabaseClient } from '@supabase/supabase-js';
import { I_Calculator } from '../models/calculator.model';
import { getSupabaseDatabase } from '../config/supabase.config';
import { T_CreateCalculationInput } from '../schemas/calculator.schema';

class CalculatorRepository {
  private supabase: SupabaseClient;
  private tableName = 'calculator';

  constructor() {
    this.supabase = getSupabaseDatabase();
  }

  async add(data: T_CreateCalculationInput & any): Promise<I_Calculator> {
    const { user_id, num1, num2 } = data;
    const operator = '+';
    const resultValue = num1 + num2;
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: user_id ?? null,
        num1,
        num2,
        operator,
        result: resultValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();

    if (error || !rows) {
      throw new Error(`Database error: ${error?.message ?? 'Unknown error'}`);
    }
    return rows as I_Calculator;
  }

  // Subtract
  async subtract(data: T_CreateCalculationInput & any): Promise<I_Calculator> {
    const { user_id, num1, num2 } = data;
    const operator = '-';
    const resultValue = num1 - num2;
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: user_id ?? null,
        num1,
        num2,
        operator,
        result: resultValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (error || !rows) {
      throw new Error(`Database error: ${error?.message ?? 'Unknown error'}`);
    }
    return rows as I_Calculator;
  }

  // Multiply
  async multiply(data: T_CreateCalculationInput & any): Promise<I_Calculator> {
    const { user_id, num1, num2 } = data;
    const operator = '*';
    const resultValue = num1 * num2;
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: user_id ?? null,
        num1,
        num2,
        operator,
        result: resultValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (error || !rows) {
      throw new Error(`Database error: ${error?.message ?? 'Unknown error'}`);
    }
    return rows as I_Calculator;
  }

  // Divide
  async divide(data: T_CreateCalculationInput & any): Promise<I_Calculator> {
    const { user_id, num1, num2 } = data;
    const operator = '/';
    if (num2 === 0) {
      throw new Error('Cannot divide by zero');
    }
    const resultValue = num1 / num2;
    const { data: rows, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: user_id ?? null,
        num1,
        num2,
        operator,
        result: resultValue,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (error || !rows) {
      throw new Error(`Database error: ${error?.message ?? 'Unknown error'}`);
    }
    return rows as I_Calculator;
  }

  // Find calculation by ID
  async findById(id: number): Promise<I_Calculator | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('id', id)
      .single();
    if (error || !data) {
      return null;
    }
    return data as I_Calculator;
  }

  // Get all calculations (optionally filtered by user)
  async findAllByUserId(
    userId?: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<I_Calculator[]> {
    let query = this.supabase.from(this.tableName).select('*');

    if (typeof userId === 'number') {
      query = query.eq('user_id', userId);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    // Type narrow for return type inference
    const { data, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data ?? []) as I_Calculator[];
  }
}

export default new CalculatorRepository();
