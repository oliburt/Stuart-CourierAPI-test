import { Response } from "express";
import { InternalServerError, isCustomError } from "../lib/errors";
import logger from "./logger";

export function handleErrorResponse(error: unknown, response: Response) {
  if (error != null) logger.error(error);
  if (isCustomError(error)) {
    return error.send(response);
  }

  return new InternalServerError().send(response);
}
