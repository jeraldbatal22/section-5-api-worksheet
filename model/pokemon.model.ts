export interface Pokemon {
  id?: string;
  name: string;
  type: string;
  level: number;
  abilities: string[];
  created_at?: string;
  updated_at?: string;
}

export interface CreatePokemonDTO {
  name: string;
  type: string;
  level: number;
  abilities: string[];
}

export interface UpdatePokemonDTO {
  name?: string;
  type?: string;
  level?: number;
  abilities?: string[];
}

// Analogous to BookmarkModel, for demonstration
export class PokemonModel implements Pokemon {
  id?: string;
  name!: string;
  type!: string;
  level!: number;
  abilities!: string[];
  created_at?: string;
  updated_at?: string;

  constructor(data: Pokemon) {
    Object.assign(this, data);
  }

  toJSON(): Pokemon {
    return { ...this };
  }
}

export default PokemonModel;