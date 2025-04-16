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
import { INotification } from "@repo/types/lib/schema/notification";
import { NotificationModel } from "../models/notification.model";

class NotificationRepository implements IBaseRepository<INotification> {
  protected model = NotificationModel;

  async create(data: INotification): Promise<INotification> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const operation = await this.model.create(
        {
          ...data,
        } as MakeNullishOptional<INotification>,
        {
          transaction,
        }
      );

      await transaction.commit();

      return getData(operation) as INotification;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

async bulkCreate(data: INotification[]): Promise<INotification[]> {
  const transaction: Transaction = await this.model.sequelize!.transaction();
  try {
    const operations = await this.model.bulkCreate(
      data as MakeNullishOptional<INotification>[],
      {
        transaction,
      }
    );
  await transaction.commit();

  return operations.map((op) => getData(op)) as INotification[];

  } catch (error) {
    await transaction.rollback();
    throw error;
  }
}
  
  async getAll<R = INotification>(
    queryParams: Omit<IQueryStringParams, "cursor">
  ): Promise<R[]> {
    console.log(queryParams);
    
    const sequelizeQuery = generateSequelizeQuery(queryParams);
    
    const response = await this.model.findAll({
      ...sequelizeQuery
    });

    return getDataArray(response);
  }

  async getById<R = INotification>(id: number): Promise<R | null> {
    const response = await this.model.findByPk(id);
    if (!response) return null;
    return getData(response);
  }

  async update(id: number, data: INotification): Promise<INotification | null> {
    const transaction: Transaction = await this.model.sequelize!.transaction();

    try {
      const currentVersion = await this.model.findByPk(id, {
        transaction,
      });
      if (!currentVersion) throw new NotFoundError();
      await this.model.update(
        {
          ...data,
        },
        {
          where: {
            id,
          },
          transaction,
        }
      );

      await transaction.commit();

      return { ...currentVersion, ...data };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async delete(id: number): Promise<void> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      await this.model.destroy({
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();

      throw error;
    }
  } 
}

export const notificationRepository = Object.freeze(new NotificationRepository());