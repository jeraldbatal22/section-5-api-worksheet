export type CurrencyCode = 'PHP' | 'USD' | 'JPN';

export interface CurrencyConverter {
  id: number;
  user_id: number;
  from_value: number;
  from_currency: CurrencyCode;
  to_currency: CurrencyCode;
  converted_value: number;
  created_at: Date;
  updated_at: Date;
}

export interface CreateCurrencyConverterDTO {
  from_value: number;
  from_currency: CurrencyCode;
  to_currency: CurrencyCode;
  converted_value: number;
}