import { Request, Response } from "express";
import sequelize from "../data";

const { Courier } = sequelize.models;

export async function fetchCourier(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const courier = await Courier.findByPk(id);
    if (courier == null) {
      res.send(null);
    }
    return res.json(courier);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}
