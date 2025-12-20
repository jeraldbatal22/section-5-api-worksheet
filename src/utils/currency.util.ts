import axios from "axios";
import {
  EXCHANGE_RATE,
} from "../config/env.config";
import { I_CurrencyCode } from "../models/currency-converter.model";

// Function to fetch exchange rates from an external API
async function fetchExchangeRates(): Promise<Record<string, number>> {
  try {
    const response = await axios.get(
      `${EXCHANGE_RATE.API_URL}?apikey=${EXCHANGE_RATE.API_KEY}`
    );
    return response.data.rates; // Return the exchange rates from USD
  } catch (error) {
    // console.error("Error fetching exchange rates", error);
    throw new Error(
      error instanceof Error ? error.message : "Unable to fetch exchange rates"
    );
  }
}

// Convert function
export async function convert(
  fromValue: number,
  fromCurrency: I_CurrencyCode,
  toCurrency: I_CurrencyCode
): Promise<number> {
  try {
    const rates = await fetchExchangeRates();
    // Convert from the source currency to USD
    const fromRate = rates[fromCurrency];

    // Convert from USD to the target currency
    const toRate = rates[toCurrency];

    // Perform the conversion: (fromValue / fromRate) * toRate
    const convertedValue = (fromValue / fromRate) * toRate;

    return convertedValue;
  } catch (error) {
    console.error("Conversion error", error);
    throw new Error("Conversion failed");
  }
}