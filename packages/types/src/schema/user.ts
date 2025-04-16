import { IBaseAttributes } from "../types.sql";

export interface IUser extends IBaseAttributes {
  email: string;
  password: string;
  username?: string;
  role?: string;
  message?: string
}