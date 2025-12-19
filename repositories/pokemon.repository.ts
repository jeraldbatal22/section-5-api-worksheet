import { SupabaseClient } from '@supabase/supabase-js';
import type { Pokemon } from '../model/pokemon.model.ts';
import { getSupabaseDatabase } from '../config/supabase.config.ts';
import { AppError } from '../middleware/error-handler.middleware.ts';
import type { CreatePokemonInput } from '../schemas/pokemon.schema.ts';

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
  async getAllPokemons(options: GetAllPokemonsOptions = {}): Promise<Pokemon[]> {
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
    return (data ?? []) as Pokemon[];
  }

  // Create a new pokemon
  async createPokemon(pokemonData: CreatePokemonInput): Promise<Pokemon> {
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
    return data as Pokemon;
  }
}

export default new PokemonRepository();
