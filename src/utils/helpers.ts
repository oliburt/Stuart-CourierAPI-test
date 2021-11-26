import { Response } from "express";
import { ValidationError } from "sequelize/dist";
import { CustomValidationError, InternalServerError, isCustomError } from "../lib/errors";
import logger from "./logger";

export function handleErrorResponse(error: unknown, response: Response) {
  if (error != null) logger.error(error);
  if (isCustomError(error)) {
    return error.send(response);
  }
  if (error instanceof ValidationError) {
    return new CustomValidationError(error).send(response);
  }
  return new InternalServerError().send(response);
}
