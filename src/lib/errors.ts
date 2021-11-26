import { Response } from "express";

export const Messages = {
  CourierNotFound: "Courier Not Found"
};

export interface CustomError extends Error {
  send(res: Response): void;
}

export class CourierNotFound extends Error {
  constructor() {
    super(Messages.CourierNotFound);
  }

  send(res: Response) {
    return res.status(404).json({ message: this.message });
  }
}
