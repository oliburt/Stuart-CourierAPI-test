import { Response } from "express";

export const Messages = {
  CourierNotFound: "Courier Not Found",
  InternalServerError: "Internal Server Error"
};

export interface CustomError extends Error {
  send(res: Response): void;
}

export function isCustomError(e: unknown): e is CustomError {
  if (e instanceof Error) {
    return "send" in e;
  }
  return false;
}

export class CourierNotFound extends Error implements CustomError {
  constructor() {
    super(Messages.CourierNotFound);
  }

  send(res: Response) {
    return res.status(404).json({ message: this.message });
  }
}

export class InternalServerError extends Error implements CustomError {
  constructor() {
    super(Messages.InternalServerError);
  }

  send(res: Response) {
    return res.status(500).json({ message: this.message });
  }
}
