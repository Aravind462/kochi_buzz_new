import { IBaseRepository } from "@repo/backend/lib/repositories/IBaseRepository";
import { IQueryStringParams } from "@repo/types/lib/types";
import { generateSequelizeQuery } from "@repo/backend/lib/utils/sequelize/generateSequelizeQuery";
import {
  getDataArray,
  getData,
} from "@repo/backend/lib/utils/sequelize/sequelizeUtils";
import { MakeNullishOptional } from "sequelize/types/utils";
import { literal, Sequelize, Transaction } from "sequelize";
import { NotFoundError } from "@repo/backend/lib/errors/NotFoundError";
import { IEvent } from "@repo/types/lib/schema/event";
import { EventModel } from "../models/event.model";
import { Op } from "sequelize";

class EventRepository implements IBaseRepository<IEvent> {
  protected model = EventModel;

  async create(data: IEvent): Promise<IEvent> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      const operation = await this.model.create(
        {
          ...data,
        } as MakeNullishOptional<IEvent>,
        {
          transaction,
        }
      );

      await transaction.commit();

      return getData(operation) as IEvent;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
  
  async getAll<R = IEvent>(
    queryParams: Omit<IQueryStringParams, "cursor">
  ): Promise<R[]> {
    console.log(queryParams);
    
    const sequelizeQuery = generateSequelizeQuery(queryParams);
    
    const response = await this.model.findAll({
      ...sequelizeQuery
    });

    return getDataArray(response);
  }

  async getById<R = IEvent>(id: number): Promise<R | null> {
    const response = await this.model.findByPk(id);
    if (!response) return null;
    return getData(response);
  }

  async getNearby<R = IEvent[]>(
    data: { latitude: number; longitude: number },
    radiusInKm = 20
  ): Promise<R> {
    const { latitude, longitude } = data;

    const events = await this.model.findAll({
      where: {
        status: "Accepted",
        [Op.and]: literal(`
          ST_Distance_Sphere(
            point(longitude, latitude),
            point(${longitude}, ${latitude})
          ) <= ${radiusInKm * 1000}
        `)
      },
      order: [
        literal(`
          ST_Distance_Sphere(
            point(longitude, latitude),
            point(${longitude}, ${latitude})
          )
        `),
      ],
      limit: 4,
    });

    console.log(events);
    
    return events as R;
  }


  async update(id: number, data: IEvent): Promise<IEvent | null> {
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

export const eventRepository = Object.freeze(new EventRepository());