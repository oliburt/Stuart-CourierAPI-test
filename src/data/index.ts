import { Sequelize } from "sequelize";

import CourierSetup from "../models/Courier";
import logger from "../utils/logger";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:",
  logging: msg => logger.debug(msg)
});

const models = [CourierSetup];
for (const setup of models) {
  setup(sequelize);
}

export default sequelize;
