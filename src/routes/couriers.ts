import express, { Express } from "express";

const router = express.Router();

export default function register(app: Express) {
  app.use("/couriers", router);
}
