import { Router } from "express";
import pokemonController from "../controller/pokemon.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

const pokemonRouter = Router();

pokemonRouter.post("/", asyncHandler(pokemonController.create));
pokemonRouter.get("/", asyncHandler(pokemonController.getAll));

export default pokemonRouter;
