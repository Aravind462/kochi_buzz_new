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
import { IReport } from "@repo/types/lib/schema/report";
import { ReportModel } from "../models/report.model";

class ReportRepository implements IBaseRepository<IReport> {
  protected model = ReportModel;

  async create(data: IReport): Promise<IReport> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const operation = await this.model.create(
        {
          ...data,
        } as MakeNullishOptional<IReport>,
        {
          transaction,
        }
      );

      await transaction.commit();

      return getData(operation) as IReport;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async getAll<R = IReport>(
    queryParams: Omit<IQueryStringParams, "cursor">
  ): Promise<R[]> {
    console.log(queryParams);
    
    const sequelizeQuery = generateSequelizeQuery(queryParams);
    
    const response = await this.model.findAll({
      ...sequelizeQuery
    });

    return getDataArray(response);
  }

  async getById<R = IReport>(id: number): Promise<R | null> {
    const response = await this.model.findByPk(id);
    if (!response) return null;
    return getData(response);
  }

  async update(id: number, data: IReport): Promise<IReport | null> {
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

export const reportRepository = Object.freeze(new ReportRepository());