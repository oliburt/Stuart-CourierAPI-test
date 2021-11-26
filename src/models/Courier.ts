import { DataTypes, Sequelize } from "sequelize";

export const ErrorMessages = {
  AvailableLTMax: "available_capacity should not exceed the maximum capacity",
  MaxGTZero: "max_capacity must be greater than zero",
  AvailableGTEZero: "available_capacity must be greater than or equal to zero"
};

export default (sequelize: Sequelize) =>
  sequelize.define(
    "Courier",
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      max_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          greaterThanZero: (value: number) => {
            if (value <= 0) {
              throw new Error(ErrorMessages.MaxGTZero);
            }
          }
        }
      },
      available_capacity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          greaterThanOrEqualToZero: (value: number) => {
            if (value < 0) {
              throw new Error(ErrorMessages.AvailableGTEZero);
            }
          }
        }
      }
    },
    {
      validate: {
        availableLessThanMax: function () {
          const courier: any = this; // Is there a better way to do this?
          if (courier.max_capacity < courier.available_capacity) {
            throw new Error(ErrorMessages.AvailableLTMax);
          }
        }
      }
    }
  );
