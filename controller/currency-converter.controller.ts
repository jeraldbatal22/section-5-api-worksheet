import currencyConverterService from "../services/currency-converter.service.ts";
import type { Response } from "express";
import { convert } from "../utils/index.ts";
import type { IAuthRequest } from "../types/index.ts";
import { ErrorResponse } from "../utils/error-response.ts";
import HttpStatus from "http-status";

class CurrencyConverterController {
  createConversion = async (req: IAuthRequest, res: Response) => {
    const { from_value, from_currency, to_currency } = req.body;

    if (typeof from_value !== "number" || !from_currency || !to_currency) {
      throw new ErrorResponse(
        HttpStatus.BAD_REQUEST,
        "Invalid input. Please provide from_value, from_currency, to_currency, and converted_value."
      );
    }

    const convertedAmount = await convert(
      from_value,
      from_currency,
      to_currency
    );

    const conversion = await currencyConverterService.saveConversion(
      req.user?.id as number,
      {
        from_value,
        from_currency,
        to_currency,
        converted_value: convertedAmount,
      }
    );
    res.status(201).json({
      success: true,
      data: conversion,
    });
  };

  getUserConversions = async (req: IAuthRequest, res: Response) => {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const offset = req.query.offset ? Number(req.query.offset) : undefined;

    const conversions = await currencyConverterService.getConversionsByUserId(
      req?.user?.id as number,
      { limit, offset }
    );
    res.status(200).json({
      success: true,
      data: conversions,
    });
  };
}

export default new CurrencyConverterController();
