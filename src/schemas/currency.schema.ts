import { z } from 'zod';

// Zod schema for currency conversion (matches Joi schema from context)
export const currencySchema = z.object({
  from_value: z
    .number()
    .nonnegative({
      message:
        'from_value must be a number. Invalid input. Please provide from_value, from_currency, to_currency, and converted_value.',
    })
    .refine(v => typeof v === 'number', {
      message:
        'from_value must be a number. Invalid input. Please provide from_value, from_currency, to_currency, and converted_value.',
    }),
  from_currency: z.enum(['PHP', 'USD', 'JPN']).refine(v => ['PHP', 'USD', 'JPN'].includes(v), {
    message:
      'from_currency must be one of PHP, USD, JPN. Invalid input. Please provide from_value, from_currency, to_currency, and converted_value.',
  }),
  to_currency: z.enum(['PHP', 'USD', 'JPN']).refine(v => ['PHP', 'USD', 'JPN'].includes(v), {
    message:
      'to_currency must be one of PHP, USD, JPN. Invalid input. Please provide from_value, from_currency, to_currency, and converted_value.',
  }),
  converted_value: z.number().optional(),
});

export type T_CurrencyInput = z.infer<typeof currencySchema>;
