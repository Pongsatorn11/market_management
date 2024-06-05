import { NextFunction, Response } from "express";
import { IUser, RequestAndUser } from "../interfaces/user.interface";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { Model } from "sequelize";

dotenv.config();

const accessPermission = async (
  req: RequestAndUser,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = req.user!;
    const { id }: { id: number } = req.body;
    if (user.isOwner !== true) {
      return res.status(400).json({ message: "This service for owner" });
    }

    const findUser: Model<IUser> | null = await User.findByPk(id);
    if (!findUser) {
      return res.status(400).json({ message: "User not found" });
    }

    if (user.landId !== findUser.dataValues.landId) {
      return res.status(400).json({ message: "You are not owner this id" });
    }
    
    next();
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default { accessPermission };
