import { DataTypes } from "sequelize";
import { sequelize } from "../config/database";

export const Store = sequelize.define("stores", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
  },
  imagePath: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
    field: "imagePath",
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    field: "name",
  },
  area: {
    type: DataTypes.ENUM(
      "a1",
      "a2",
      "a3",
      "a4",
      "a5",
      "b1",
      "b2",
      "b3",
      "b4",
      "b5",
      "b6",
      "b7",
      "b8",
      "c1",
      "c2",
      "c3",
      "c4",
      "c5",
      "c6",
      "c7",
      "c8",
      "d1",
      "d2",
      "d3",
      "d4",
      "d5",
      "d6",
      "d7",
      "d8",
      "e1",
      "e2",
      "e3",
      "e4",
      "e5",
      "e6",
      "e7",
      "e8",
      "f1",
      "f2",
      "f3",
      "f4",
      "f5"
    ),
    allowNull: false,
    field: "area",
  },
  details: {
    type: DataTypes.STRING || null,
    allowNull: true,
    defaultValue: null,
    field: "details",
  },
  rentPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 2500,
    field: "rentPrice",
  },
  landId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "landId",
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    field: "userId",
  },
});
