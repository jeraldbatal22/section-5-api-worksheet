import { Router } from 'express';
import pokemonController from '../controllers/pokemon.controller';
import { asyncHandler } from '../middlewares/async-handler.middleware';
import { authorizeRoles } from '../middlewares/authorize-roles.middleware';
import authorizeMiddleware from '../middlewares/auth.middleware';
import { validate } from '../middlewares/validation.middleware';
import { createPokemonSchema } from '../schemas/pokemon.schema';

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
