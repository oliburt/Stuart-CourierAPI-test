import { Response } from "express";
import logger from "./logger";

export function handleErrorResponse(error: any, response: Response) {
  if (error != null) logger.error(error);
  return error?.send(response);
}
