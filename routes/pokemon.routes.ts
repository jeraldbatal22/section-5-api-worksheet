import { Router } from 'express';
import pokemonController from '../controller/pokemon.controller.ts';
import { asyncHandler } from '../middleware/async-handler.ts';
import { authorizeRoles } from '../middleware/authorize-roles.middleware.ts';
import authorizeMiddleware from '../middleware/auth.middleware.ts';
import { validate } from '../middleware/validation.middleware.ts';
import { createPokemonSchema } from '../schemas/pokemon.schema.ts';

const pokemonRouter = Router();

pokemonRouter.post(
  '/',
  authorizeMiddleware,
  authorizeRoles('pro'),
  validate(createPokemonSchema),
  asyncHandler(pokemonController.create)
);
pokemonRouter.get('/', asyncHandler(pokemonController.getAll));

export default pokemonRouter;
