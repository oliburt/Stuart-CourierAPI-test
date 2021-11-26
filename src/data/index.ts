import { Sequelize } from "sequelize";

import CourierSetup from "../models/Courier";

export const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: ":memory:"
});

const models = [CourierSetup];
for (const setup of models) {
  setup(sequelize);
}

export default sequelize;
