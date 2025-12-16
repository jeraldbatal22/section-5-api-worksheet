import { SupabaseClient } from "@supabase/supabase-js";
import type {
  CurrencyConverter,
  CreateCurrencyConverterDTO,
  CurrencyCode,
} from "../model/currency-converter.model.ts";
import supabase from "../utils/supabase/server.ts";

class CurrencyConverterRepository {
  private supabase: SupabaseClient;
  private tableName = "currency_converters";

  constructor() {
    this.supabase = supabase;
  }

  // Save a new currency conversion record
  async saveConversion(
    userId: number,
    data: CreateCurrencyConverterDTO
  ): Promise<CurrencyConverter> {
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
      .select("*")
      .single();
    if (error || !result) {
      throw new Error(`Database error: ${error?.message ?? "Unknown error"}`);
    }
    return result as CurrencyConverter;
  }

  // Get a single currency conversion by its from/to currencies, from_value and user id,
  // only by exact direction
  async getConversionByCurrenciesByUserId(
    userId: number,
    currencyA: CurrencyCode,
    currencyB: CurrencyCode,
    fromValue: number
  ): Promise<CurrencyConverter | null> {
    const { data, error } = await this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .eq("from_value", fromValue)
      .eq("from_currency", currencyA)
      .eq("to_currency", currencyB)
      .limit(1)
      .maybeSingle();

    if (error || !data) return null;
    return data as CurrencyConverter;
  }

  // Get all currency conversions for a user, paginated
  async getConversionsByUserId(
    userId: number,
    limit: number = 10,
    offset: number = 0
  ): Promise<CurrencyConverter[]> {
    let query = this.supabase
      .from(this.tableName)
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw new Error(`Database error: ${error.message}`);
    return (data ?? []) as CurrencyConverter[];
  }
}

export default new CurrencyConverterRepository();
