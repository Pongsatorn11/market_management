import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";


export const Land = sequelize.define("lands", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
  },
  WaterPriceUnit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: "WaterPriceUnit",
  },
  electricityPriceUnit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1,
    field: "electricityPriceUnit",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "userId",
  },
});
