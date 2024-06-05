import { Request, Response } from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import { Model, Op } from "sequelize";
import jwt from "jsonwebtoken";

import { IUser, RequestAndUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { Land } from "../models/land.model";

dotenv.config();

const register = async (req: Request, res: Response) => {
  try {
    const {
      imagePath,
      firstName,
      lastName,
      username,
      password,
      email,
      address,
      phoneNumber,
    }: {
      imagePath?: string;
      firstName?: string;
      lastName?: string;
      username: string;
      password: string;
      email?: string;
      address?: string;
      phoneNumber?: string;
    } = req.body;

    const exitUser: Model<IUser> | null = await User.findOne({
      where: { username },
    });
    if (exitUser) {
      return res.status(400).json({
        message: `There is already a user named ${username}.`,
      });
    }
    const hashPassword: string = await bcrypt.hash(password, 10);
    const isOwner: boolean = true;
    const data = {
      imagePath: imagePath ? imagePath : "",
      firstName,
      lastName,
      username,
      hashPassword,
      email,
      address,
      phoneNumber,
      isOwner,
    };
    const userCreate: Model<IUser> | null = await User.create({
      ...data,
    });

    if (!userCreate) {
      return res.status(404).json({ message: "Fail to register" });
    }

    const landCreate = await Land.create({
      userId: userCreate.dataValues.id,
    });

    if (!landCreate) {
      return res.status(404).json({ message: "Fail to register" });
    }

    const updateUser = await User.update(
      { landId: landCreate.dataValues.id },
      { where: { id: userCreate.dataValues.id } }
    );

    if (!updateUser) {
      return res.status(404).json({ message: "Fail to register" });
    }

    return res.status(201).json({ message: "Create user success" });
  } catch (error: any) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const findUser: Model<IUser> | null = await User.findOne({
      where: { username },
    });
    if (!findUser) {
      return res.status(400).json({
        message: `Password or Username Wrong.`,
      });
    }
    const passwordIsMatch = await bcrypt.compare(
      password,
      findUser.dataValues.hashPassword!
    );
    if (!passwordIsMatch) {
      return res.status(400).json({
        message: `Password or Username Wrong.`,
      });
    }

    const token = await jwt.sign(
      { id: String(findUser.dataValues.id) },
      process.env.JWT_SECRET!,
      {
        expiresIn: "5h",
      }
    );
    return res.status(200).json({ token: token });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const self = async (req: RequestAndUser, res: Response) => {
  return res.status(200).json(req.user);
};

const updateSelf = async (req: RequestAndUser, res: Response) => {
  const user: IUser = req.user!;
  const {
    imagePath,
    firstName,
    lastName,
    email,
    address,
    phoneNumber,
  }: {
    imagePath?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
    address?: string;
    phoneNumber?: string;
  } = req.body;

  const updateUser: any = await User.update(
    {
      imagePath,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
    },
    { where: { id: user.id } }
  );
  if (!updateUser) {
    return res.status(404).json({ message: "Fail to update" });
  }
  return res.status(200).json({ message: "Update success" });
};

const getUsers = async (req: RequestAndUser, res: Response) => {
  try {
    const user: IUser = req.user!;
    const { perPage = 10, page = 1, status } = req.query;
    const offset = (Number(page) - 1) * Number(perPage);
    const findUsersByLand: Model<IUser>[] | null = await User.findAll({
      where: {
        landId: user.landId,
        id: { [Op.ne]: user.id },
      },
      attributes: { exclude: ["hashPassword"] },
      limit: Number(perPage),
      offset: offset,
    });
    return res.status(200).json({
      page: Number(page),
      perPage: Number(perPage),
      total: findUsersByLand.length,
      items: findUsersByLand,
    });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserById = async (req: RequestAndUser, res: Response) => {
  try {
    const user: IUser = req.user!;
    const { id } = req.params;
    const findUserById: Model<IUser>[] | null = await User.findAll({
      where: {
        id,
      },
      attributes: { exclude: ["hashPassword"] },
    });
    return res.status(200).json(findUserById);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const getUserByStoreId = async (req: RequestAndUser, res: Response) => {
  try {
    const user: IUser = req.user!;
    const { id } = req.params;
    const findUserByStoreId: Model<IUser>[] | null = await User.findAll({
      where: {
        storeId: id,
      },
      attributes: { exclude: ["hashPassword"] },
    });
    return res.status(200).json(findUserByStoreId);
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

const updateUser = async (req: RequestAndUser, res: Response) => {
  try {
    const {
      id,
      imagePath,
      firstName,
      lastName,
      email,
      address,
      phoneNumber,
    }: {
      id: number;
      imagePath?: string;
      firstName?: string;
      lastName?: string;
      email?: string;
      address?: string;
      phoneNumber?: string;
    } = req.body;

    const updateUser: any = await User.update(
      {
        imagePath,
        firstName,
        lastName,
        email,
        address,
        phoneNumber,
      },
      {
        where: {
          id: id,
        },
      }
    );
    if (!updateUser) {
      return res.status(404).json({ message: "Fail to update" });
    }
    return res.status(200).json({ message: "Update success" });
  } catch (error) {
    return res.status(500).json({ message: "Something went wrong" });
  }
};

export default {
  register,
  login,
  self,
  updateSelf,
  getUsers,
  getUserById,
  getUserByStoreId,
  updateUser,
};
