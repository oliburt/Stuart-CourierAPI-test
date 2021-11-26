import process from "process";
import app from "./app";
import config from "./config";
import sequelize from "./data/index";

// Exit process on Ctrl-C in Docker container
process.on("SIGINT", () => {
  process.exit(0);
});

sequelize.sync().then(() => {
  app.listen(config.PORT, () => {
    console.log("Server listening on port:", config.PORT);
  });
});
