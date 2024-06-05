import { Response } from "express";
import { IUser, RequestAndUser } from "../interfaces/user.interface";
import dotenv from "dotenv";
import { Model } from "sequelize";
import { ILand } from "../interfaces/land.interface";
import { Land } from "../models/land.model";

dotenv.config();

const getLandByOwner = async (req: RequestAndUser, res: Response) => {
  try {
    const user: IUser = req.user!;
    const findLand: Model<ILand> | null = await Land.findOne({
      where: { id: user.landId },
    });
    if (!findLand) {
      return res.status(404).json({ message: "Land not found" });
    }
    return res.status(200).json(findLand);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateWaterPriceElectricityPriceUnitLandById = async (
  req: RequestAndUser,
  res: Response
) => {
  try {
    const user: IUser = req.user!;
    const { WaterPriceUnit = undefined, electricityPriceUnit = undefined } = req.body;



    await Land.update(
      { WaterPriceUnit, electricityPriceUnit },
      { where: { id: user.landId } }
    );
    return res.status(201).json({ message: "Update success" });
  } catch (error) {
    return res.status(500).json({ message: "Fail to create" });
  }
};

export default {
  getLandByOwner,
  updateWaterPriceElectricityPriceUnitLandById,
};
