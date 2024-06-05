import jwt from "jsonwebtoken";
import { NextFunction, Response } from "express";
import {
  IUser,
  NextFunctionAndUser,
  RequestAndUser,
  ResponseAndUser,
} from "../interfaces/user.interface";
import dotenv from "dotenv";
import { User } from "../models/user.model";
import { Model } from "sequelize";

dotenv.config();

const authenticateToken = async (
  req: RequestAndUser,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  jwt.verify(
    token,
    process.env.JWT_SECRET!,
    async (
      err: jwt.VerifyErrors | null,
      decode: any | { id: number }
    ): Promise<NextFunctionAndUser | ResponseAndUser | any> => {
      if (err) {
        return res.status(403).json({ message: "Token is expired" });
      }
      let findUser: Model<IUser> | null = await User.findOne({
        where: { id: decode.id },
      });
      if (!findUser) {
        return res.status(403).json({ message: "User Not Found" });
      }
      delete findUser.dataValues.hashPassword;
      req.user = findUser.dataValues;
      next();
    }
  );
};

export default { authenticateToken };
