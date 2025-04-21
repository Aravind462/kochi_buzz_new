import { IBaseRepository } from "@repo/backend/lib/repositories/IBaseRepository";
import { IQueryStringParams } from "@repo/types/lib/types";
import { generateSequelizeQuery } from "@repo/backend/lib/utils/sequelize/generateSequelizeQuery";
import {
  getDataArray,
  getData,
} from "@repo/backend/lib/utils/sequelize/sequelizeUtils";
import { MakeNullishOptional } from "sequelize/types/utils";
import { Transaction } from "sequelize";
import { NotFoundError } from "@repo/backend/lib/errors/NotFoundError";
import { IUser } from "@repo/types/lib/schema/user";
import { UserModel } from "../models/user.model";

class UserRepository implements IBaseRepository<IUser, number> {
  protected model = UserModel;

  async getAll<R = IUser>(
    queryParams: Omit<IQueryStringParams, "cursor">
  ): Promise<R[]> {
    const sequelizeQuery = generateSequelizeQuery(queryParams);
    const response = await this.model.findAll({
      ...sequelizeQuery,
    });

    return getDataArray(response);
  }

  async getById<R = IUser>(id: number): Promise<R | null> {
    const response = await this.model.findByPk(id);
    if (!response) return null;
    return getData(response);
  }


//   async update(id: number, data: IUser): Promise<IUser | null> {
//     const transaction: Transaction = await this.model.sequelize!.transaction();

//     try {
//       const currentVersion = await this.model.findByPk(id, {
//         transaction,
//       });
//       if (!currentVersion) throw new NotFoundError();
//       await this.model.update(
//         {
//           ...data,
//         },
//         {
//           where: {
//             id,
//           },
//           transaction,
//         }
//       );

//       await transaction.commit();

//       return { ...currentVersion, ...data };
//     } catch (error) {
//       await transaction.rollback();
//       throw error;
//     }
//   }

//   async delete(id: number): Promise<void> {
//     const transaction: Transaction = await this.model.sequelize!.transaction();
//     try {
//       await this.model.destroy({
//         where: {
//           id,
//         },
//         transaction,
//       });
//       await transaction.commit();
//     } catch (error) {
//       await transaction.rollback();

//       throw error;
//     }
//   }
}

export const userRepository = Object.freeze(new UserRepository());