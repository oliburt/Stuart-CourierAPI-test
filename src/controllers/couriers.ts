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

export async function createCourier(req: Request, res: Response) {
  try {
    const { id, max_capacity } = req.body;

    const courier = await Courier.create({
      id,
      max_capacity,
      available_capacity: max_capacity // When courier is first created, available_capacity is equal to max_capacity
    });

    return res.status(201).json(courier);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}

export async function updateCourierCapacity(req: Request, res: Response) {
  try {
  } catch (error) {
    handleErrorResponse(error, res);
  }
}
