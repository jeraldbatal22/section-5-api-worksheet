export type I_CurrencyCode = 'PHP' | 'USD' | 'JPN';

export interface I_CurrencyConverter {
  id: number;
  user_id: number;
  from_value: number;
  from_currency: I_CurrencyCode;
  to_currency: I_CurrencyCode;
  converted_value: number;
  created_at: Date;
  updated_at: Date;
}

export interface I_CreateCurrencyConverterDTO {
  from_value: number;
  from_currency: I_CurrencyCode;
  to_currency: I_CurrencyCode;
  converted_value: number;
}
