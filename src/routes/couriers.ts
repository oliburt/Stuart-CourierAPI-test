import express, { Express } from "express";

import { fetchCourier, createCourier } from "../controllers/couriers";

const router = express.Router();

router.get("/:id", fetchCourier);

router.post("/", createCourier);

export default function register(app: Express) {
  app.use("/couriers", router);
}
