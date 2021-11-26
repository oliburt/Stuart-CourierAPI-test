import express, { Express } from "express";

import {
  fetchCourier,
  createCourier,
  updateCourierCapacity
} from "../controllers/couriers";

const router = express.Router();

router.get("/:id", fetchCourier);

router.post("/", createCourier);

router.patch("/:id", updateCourierCapacity);

export default function register(app: Express) {
  app.use("/couriers", router);
}
