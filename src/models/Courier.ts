import { DataTypes } from "sequelize";
import sequelize from "../data/index";

export default sequelize.define("Courier", {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: DataTypes.INTEGER
  },
  max_capacity: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
});
