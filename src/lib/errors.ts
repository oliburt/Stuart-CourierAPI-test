import { ValidationError } from "sequelize/dist";

export const Messages = {
  CourierNotFound: "Courier Not Found",
  InternalServerError: "Internal Server Error"
};

export interface CustomError extends Error {
  send(res: Response): void;
}

interface Response {
  status(status: number): Response;
  json(obj: any): Response;
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

// Handle Responses from Validation Errors thrown by sequelize
export class CustomValidationError extends Error implements CustomError {
  constructor(e: ValidationError) {
    // ValidationError has a list of errors (if there are multiple invalid fields)
    // Combining the error messages into one message
    const message = e.errors.reduce(
      (msg, e, i) => (i === 0 ? `${msg} ${e.message}` : `${msg}, ${e.message}`),
      "Validation Error:"
    );
    super(message);
  }

  send(res: Response) {
    return res.status(422).json({ message: this.message });
  }
}
