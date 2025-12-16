import type { Response, NextFunction, Request } from "express";
import PokemonService from "../services/pokemon.service.ts";

class PokemonController {
  async getAll(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const type = req.query.type ? String(req.query.type) : undefined;
      const name = req.query.name ? String(req.query.name) : undefined;

      const result = await PokemonService.getAllPokemons({
        type,
        name,
      });

      res.status(200).json({
        success: true,
        data: result.data,
        pagination: result.pagination,
        message: "Successfully Fetched Pokemons",
      });
    } catch (error) {
      next(error);
    }
  }

  async create(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { name, type, level, abilities } = req.body;
      const created = await PokemonService.createPokemon({
        name,
        type,
        level,
        abilities,
      });
      res.status(201).json({
        success: true,
        data: created || null,
        message: "Successfully Created Post",
      });
    } catch (error) {
      next(error);
    }
  }
}

export default new PokemonController();
