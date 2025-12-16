import { Router } from "express";
import currencyConverterController from "../controller/currency-converter.controller.ts";
import { asyncHandler } from "../middleware/async-handler.ts";

const currencyConvertRouter = Router();

currencyConvertRouter.post("/", asyncHandler(currencyConverterController.createConversion));
currencyConvertRouter.get("/", asyncHandler(currencyConverterController.getUserConversions));

export default currencyConvertRouter;
