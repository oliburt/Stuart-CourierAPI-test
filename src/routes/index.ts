import { Express } from "express";
import couriers from "./couriers";

export interface RegisterRoute {
  (app: Express): void;
}

const routes: RegisterRoute[] = [couriers];

function registerRoutes(app: Express) {
  for (const register of routes) {
    register(app);
  }
}

export default registerRoutes;
