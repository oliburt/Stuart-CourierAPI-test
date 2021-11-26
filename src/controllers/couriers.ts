import { Request, response, Response } from "express";
import { Op } from "sequelize";
import sequelize from "../data";
import { CourierNotFound, InvalidInputError } from "../lib/errors";
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
    const courier = await sequelize.transaction(t =>
      Courier.create(
        {
          id,
          max_capacity,
          available_capacity: max_capacity // When courier is first created, available_capacity is equal to max_capacity
        },
        { transaction: t }
      )
    );
    return res.status(201).json(courier);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}

export async function updateCourierCapacity(req: Request, res: Response) {
  try {
    const { available_capacity } = req.body;
    const { id } = req.params;

    // Transaction with lock to avoid race conditions with lookup
    const result = await sequelize.transaction(async t => {
      const courier = await Courier.findByPk(id, { transaction: t, lock: true });
      if (courier == null) {
        throw new CourierNotFound();
      }
      courier.set("available_capacity", available_capacity);
      await courier.save({ transaction: t });
      return courier;
    });

    return res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}

function getValidatedCapacity(requiredCapacity: any) {
  const parsed = parseInt(requiredCapacity);
  if (Number.isNaN(parsed)) {
    throw new InvalidInputError("capacity_required must be a number");
  }
  return parsed;
}

export async function lookupCouriersByCapacity(req: Request, res: Response) {
  try {
    const { capacity_required } = req.body;
    const cap = getValidatedCapacity(capacity_required);
    const result = await sequelize.transaction(async t => {
      const couriers = await Courier.findAll({
        where: {
          available_capacity: {
            [Op.gte]: cap
          }
        },
        transaction: t,
        skipLocked: true // skip locked couriers
      });
      return couriers;
    });
    return res.status(200).json(result);
  } catch (error) {
    handleErrorResponse(error, res);
  }
}
