export interface I_Pokemon {
  id?: string;
  name: string;
  type: string;
  level: number;
  abilities: string[];
  created_at?: string;
  updated_at?: string;
}
export class PokemonModel implements I_Pokemon {
  id?: string;
  name!: string;
  type!: string;
  level!: number;
  abilities!: string[];
  created_at?: string;
  updated_at?: string;

  constructor(data: I_Pokemon) {
    Object.assign(this, data);
  }

  toJSON(): I_Pokemon {
    return { ...this };
  }
}

export default PokemonModel;
