import { z } from 'zod';

export const createPokemonSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.string().min(1, 'Type is required'),
  level: z.number().int().min(1, 'Level must be a positive integer'),
  abilities: z.array(z.string()).min(1, 'At least one ability is required'),
});

export const updatePokemonSchema = z.object({
  name: z.string().optional(),
  type: z.string().optional(),
  level: z.number().int().min(1, 'Level must be a positive integer').optional(),
  abilities: z.array(z.string()).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  { message: 'At least one field must be updated.' }
);

export type CreatePokemonInput = z.infer<typeof createPokemonSchema>;
export type UpdatePokemonInput = z.infer<typeof updatePokemonSchema>;
