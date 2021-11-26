import winston from "winston";
import config from "../config";

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format: winston.format.json(),
  transports: [
    new winston.transports.File({
      filename: `logs/error.${config.ENV}.log`,
      level: "error"
    }),
    new winston.transports.File({ filename: `logs/combined.${config.ENV}.log` })
  ]
});

export default logger;
