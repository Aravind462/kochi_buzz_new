import { getData } from "@repo/backend/lib/utils/sequelize/sequelizeUtils";
import { MakeNullishOptional } from "sequelize/types/utils";
import { Transaction } from "sequelize";
import { IUser } from "@repo/types/lib/schema/user";
import { UserModel } from "../models/user.model";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class AuthRepository {
  protected model = UserModel;

  async signup(data: IUser): Promise<IUser | { message: string}> {
    const transaction: Transaction = await this.model.sequelize!.transaction();

    try {
      const existingUser = await this.model.findOne({ where: { email: data.email } });
      if (existingUser){
        return { message: "Account already exists" }
      }

      const hashPassword = await bcrypt.hash(data.password, 10);
      data.password = hashPassword;

      const operation = await this.model.create(
        {
          ...data,
        } as MakeNullishOptional<IUser>,
        {
          transaction,
        }
      );

      await transaction.commit();

      return getData(operation) as IUser;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async login(data: IUser): Promise<{user: IUser, accessToken: string} | null>{
    const { email, password } = data;
    const response = await this.model.findOne({ where : { email }});
    if(!response) return null;
    const passwordResponse = await bcrypt.compare(password, response.password);
    if(!passwordResponse) return null;
    const accessToken = jwt.sign({id: response.id}, process.env.JWTPASSWORD);
    return {user: getData(response), accessToken};
  }
}

export const authRepository = Object.freeze(new AuthRepository());