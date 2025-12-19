import type { Response, NextFunction, Request } from 'express';
import PokemonService from '../services/pokemon.service.ts';
import { ResponseHandler } from '../utils/response-handler.ts';

class PokemonController {
  async getAll(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const type = req.query.type ? String(req.query.type) : undefined;
      const name = req.query.name ? String(req.query.name) : undefined;

      const result = await PokemonService.getAllPokemons({
        type,
        name,
      });

      ResponseHandler.success(res, result.data || null, 'Retrieved chat history successfully');
    } catch (error) {
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { name, type, level, abilities } = req.body;
      const created = await PokemonService.createPokemon({
        name,
        type,
        level,
        abilities,
      });
      ResponseHandler.success(res, created || null, 'Successfully Created Post', 201);
    } catch (error) {
      next(error);
    }
  }
}

export default new PokemonController();
