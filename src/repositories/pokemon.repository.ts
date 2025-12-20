import { SupabaseClient } from '@supabase/supabase-js';
import  { I_Pokemon } from '../models/pokemon.model';
import { getSupabaseDatabase } from '../config/supabase.config';
import { AppError } from '../middlewares/error-handler.middleware';
import  { T_CreatePokemonInput } from '../schemas/pokemon.schema';

interface GetAllPokemonsOptions {
  type?: string;
  name?: string;
  limit?: number;
  offset?: number;
}

class PokemonRepository {
  private supabase: SupabaseClient;
  private tableName = 'pokemons';

  constructor() {
    this.supabase = getSupabaseDatabase();
  }

  // Get all pokemons, with optional type filter and name search
  async getAllPokemons(options: GetAllPokemonsOptions = {}): Promise<I_Pokemon[]> {
    const { type, name, limit = 10, offset = 0 } = options;

    let query = this.supabase.from(this.tableName).select('*');

    if (type) {
      query = query.eq('type', type);
    }
    if (name) {
      // Use ilike for case-insensitive search
      query = query.ilike('name', `%${name}%`);
    }

    query = query.order('created_at', { ascending: false }).range(offset, offset + limit - 1);

    const { data, error } = await query;
    if (error) throw new AppError(500, `Database error: ${error.message}`);
    return (data ?? []) as I_Pokemon[];
  }

  // Create a new pokemon
  async createPokemon(pokemonData: T_CreatePokemonInput): Promise<I_Pokemon> {
    const { name, type, level, abilities } = pokemonData;
    const { data, error } = await this.supabase
      .from(this.tableName)
      .insert({
        name,
        type,
        level,
        abilities,
        created_at: new Date().toISOString(),
      })
      .select('*')
      .single();
    if (error || !data) {
      throw new AppError(500, `Database error: ${error?.message ?? 'Unknown error'}`);
    }
    return data as I_Pokemon;
  }
}

export default new PokemonRepository();
