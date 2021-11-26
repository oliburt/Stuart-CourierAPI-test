import { Options } from "sequelize";
import logger from "../utils/logger";

interface DBConfig {
  [key: string]: Options;
}

const config: DBConfig = {
  development: {
    dialect: "sqlite",
    storage: "src/data/dev.sqlite",
    logging: msg => logger.debug(msg)
  },
  test: {
    dialect: "sqlite",
    storage: ":memory:",
    logging: msg => logger.debug(msg)
  },
  production: {
    dialect: "sqlite",
    storage: "src/data/prod.sqlite",
    logging: msg => logger.debug(msg)
  }
};

export default config;
