import {Sequelize} from 'sequelize';
import dotenv from "dotenv";

dotenv.config();
export const sequelize = new Sequelize({
  dialect: "mysql",
  host: process.env.MYSQL_HOST!,
  username: process.env.MYSQL_USERNAME!,
  password: process.env.MYSQL_PASSWORD!,
  database: process.env.MYSQL_DATABASE!,
});




