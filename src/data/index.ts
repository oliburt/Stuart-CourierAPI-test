import { Sequelize } from "sequelize";

import config from "../config";
import dbConfig from "./config";

import CourierSetup from "../models/Courier";

const options = dbConfig[config.ENV];
export const sequelize = new Sequelize(options);

const models = [CourierSetup];
for (const setup of models) {
  setup(sequelize);
}

export default sequelize;
