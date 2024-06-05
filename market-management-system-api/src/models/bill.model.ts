import { sequelize } from "../config/database";
import { DataTypes } from "sequelize";

export const Bill = sequelize.define("bills", {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    field: "id",
  },
  status: {
    type: DataTypes.ENUM("success", "pending"),
    allowNull: false,
    defaultValue: "pending",
    field: "status",
  },
  rentPrice: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "rentPrice",
  },
  WaterPriceUnit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "WaterPriceUnit",
  },
  electricityPriceUnit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "electricityPriceUnit",
  },
  waterBill: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "waterBill",
  },
  electricityBill: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "electricityBill",
  },
  waterUnit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "waterUnit",
  },
  waterUnitBefore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "waterUnitBefore",
  },
  electricityUnit: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "electricityUnit",
  },
  electricityUnitBefore: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "electricityUnitBefore",
  },
  InvoicePdfPath:{
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
    field: "InvoicePdfPath",
  },
  ReceiptPdfPath:{
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
    field: "ReceiptPdfPath",
  },
  total:{
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: 0,
    field: "total",
  },
  landId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "landId",
  },
  storeId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    field: "storeId",
  },
});
