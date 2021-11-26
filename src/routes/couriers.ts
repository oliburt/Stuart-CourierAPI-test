import express, { Express } from "express";

import { fetchCourier } from "../controllers/couriers";

const router = express.Router();

router.get("/:id", fetchCourier);

export default function register(app: Express) {
  app.use("/couriers", router);
}
