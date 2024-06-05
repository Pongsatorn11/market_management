import { NextFunction, Request, Response } from "express";

export interface IUser {
  id: number;
  imagePath?: string;
  firstName: string;
  lastName: string;
  username: string;
  hashPassword?: string;
  email: string;
  address: string;
  phoneNumber: string;
  isOwner: boolean;
  landId: number | null;
  storeId: number | null;
  createAt: Date;
}

export interface RequestAndUser extends Request {
  user?: IUser;
}

export interface ResponseAndUser extends Response {
  user?: IUser;
}

export interface NextFunctionAndUser extends NextFunction {
  user?: IUser;
}
