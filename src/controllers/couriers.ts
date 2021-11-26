import { Request, Response } from "express";

export async function fetchCourier(req: Request, res: Response) {
  const dummy = { id: 123, capacity: 10 };
  return res.json(dummy);
}
