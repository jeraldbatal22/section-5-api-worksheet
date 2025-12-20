import pokemonRepository from '../repositories/pokemon.repository';
import { AppError } from '../middlewares/error-handler.middleware';
import HttpStatus from 'http-status';
import { PaginationHelper } from '../utils/pagination.util';
import { I_Pokemon } from '../models/pokemon.model';

export interface PokemonListOptions {
  type?: string;
  name?: string;
  limit?: number;
  offset?: number;
}

// For pagination, you can expand as needed
export interface PaginatedPokemons {
  data: I_Pokemon[];
  pagination: {
    limit: number;
    offset: number;
    count: number;
    hasMore: boolean;
  };
}

class PokemonService {
  // Get all pokemons (with type/name search & pagination)
  async getAllPokemons(options: PokemonListOptions = {}): Promise<any> {
    const { type, name } = options;
    const { limit, offset } = PaginationHelper.normalize(options);

    // Basic validation for pagination
    const safeLimit = Math.min(Math.max(limit, 1), 100);
    const safeOffset = Math.max(offset, 0);
    const pokemons = await pokemonRepository.getAllPokemons({
      type,
      name,
      limit: safeLimit,
      offset: safeOffset,
    });
    // but for now, simulate as count= pokemons.length if not real "total"
    const count = pokemons.length;
    return PaginationHelper.paginate(pokemons, count, { limit, offset });

  }

  // Create a new Pokemon
  async createPokemon(data: I_Pokemon): Promise<I_Pokemon> {
    if (!data.name || typeof data.name !== 'string' || data.name.trim().length === 0) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Name must be a non-empty string');
    }
    if (!data.type || typeof data.type !== 'string' || data.type.trim().length === 0) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Type must be a non-empty string');
    }
    if (typeof data.level !== 'number' || isNaN(data.level) || data.level < 1) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Level must be a number greater than 0');
    }
    if (
      !Array.isArray(data.abilities) ||
      data.abilities.length === 0 ||
      !data.abilities.every(a => typeof a === 'string' && a.length > 0)
    ) {
      throw new AppError(HttpStatus.BAD_REQUEST, 'Abilities must be a non-empty array of strings');
    }

    // Trim fields
    const trimmedData: I_Pokemon = {
      name: data.name.trim(),
      type: data.type.trim(),
      level: data.level,
      abilities: data.abilities.map(a => a.trim()),
    };

    return await pokemonRepository.createPokemon(trimmedData);
  }
}

export default new PokemonService();
