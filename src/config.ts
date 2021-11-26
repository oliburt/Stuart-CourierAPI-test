import dotenv from "dotenv";

dotenv.config();

const config = {
  ENV: process.env.NODE_ENV || "development",
  PORT: process.env.PORT || "3000",
  LOG_LEVEL: process.env.LOG_LEVEL || "info"
};

export default config;
