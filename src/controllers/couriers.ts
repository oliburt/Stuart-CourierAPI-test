import { Request, Response } from "express";
import sequelize from "../data";
import { CourierNotFound } from "../lib/errors";
import { handleErrorResponse } from "../utils/helpers";

const { Courier } = sequelize.models;

export async function fetchCourier(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const courier = await Courier.findByPk(id);
    if (courier == null) {
      throw new CourierNotFound();
    }
    return res.json(courier);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}
