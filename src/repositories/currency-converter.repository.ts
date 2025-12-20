import { SupabaseClient } from '@supabase/supabase-js';
import { I_CurrencyConverter, I_CurrencyCode } from '../models/currency-converter.model';
import { getSupabaseDatabase } from '../config/supabase.config';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';
import { T_CurrencyInput } from '../schemas/currency.schema';

class CurrencyConverterRepository {
  private supabase: SupabaseClient;
  private tableName = 'currency_converters';

  constructor() {
    this.supabase = getSupabaseDatabase();
  }

  // Save a new currency conversion record
  async saveConversion(userId: number, data: T_CurrencyInput): Promise<I_CurrencyConverter> {
    const { from_value, from_currency, to_currency, converted_value } = data;
    const { data: result, error } = await this.supabase
      .from(this.tableName)
      .insert({
        user_id: userId,
        from_value,
        from_currency,
        to_currency,
        converted_value,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (error || !result) {
      throw new AppError(
        HttpStatus.INTERNAL_SERVER_ERROR,
        `Database error: ${error?.message ?? 'Unknown error'}`
      );
    }
    return result as I_CurrencyConverter;
  }

  // Get a single currency conversion by its from/to currencies, from_value and user id,
  // only by exact direction
  async getConversionByCurrenciesByUserId(
    userId: number,
    currencyA: I_CurrencyCode,
    currencyB: I_CurrencyCode,
    fromValue: number
  ): Promise<I_CurrencyConverter | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .eq('from_value', fromValue)
      .eq('from_currency', currencyA)
      .eq('to_currency', currencyB)
      .limit(1)
      .maybeSingle();

    if (error) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, `Database error: ${error.message}`);
    }
    if (!data) return null;
    return data as I_CurrencyConverter;
  }

  // Get all currency conversions for a user, paginated
  async getConversionsByUserId(
    userId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<I_CurrencyConverter[]> {
    let query = this.supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) {
      throw new AppError(HttpStatus.INTERNAL_SERVER_ERROR, `Database error: ${error.message}`);
    }
    return (data ?? []) as I_CurrencyConverter[];
  }
}

export default new CurrencyConverterRepository();
