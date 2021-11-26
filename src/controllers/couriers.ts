import { Request, Response } from "express";
import { Op } from "sequelize/dist";
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
    const { available_capacity } = req.body;
    const { id } = req.params;
    const courier = await Courier.findByPk(id);
    if (courier == null) {
      throw new CourierNotFound();
    }
    courier.set("available_capacity", available_capacity);
    await courier.save();

    return res.status(200).json(courier);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}

export async function lookupCouriersByCapacity(req: Request, res: Response) {
  try {
    const { capacity_required } = req.body;

    const couriers = await Courier.findAll({
      where: {
        available_capacity: {
          [Op.gte]: capacity_required
        }
      }
    });

    return res.status(200).json(couriers);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}
