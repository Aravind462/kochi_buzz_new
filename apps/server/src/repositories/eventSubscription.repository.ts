import { IBaseRepository } from "@repo/backend/lib/repositories/IBaseRepository";
import { IQueryStringParams } from "@repo/types/lib/types";
import { generateSequelizeQuery } from "@repo/backend/lib/utils/sequelize/generateSequelizeQuery";
import {
  getDataArray,
  getData,
} from "@repo/backend/lib/utils/sequelize/sequelizeUtils";
import { MakeNullishOptional } from "sequelize/types/utils";
import { Sequelize, Transaction } from "sequelize";
import { NotFoundError } from "@repo/backend/lib/errors/NotFoundError";
import { IEventSubscription } from "@repo/types/lib/schema/eventSubscription";
import { EventSubscriptionModel } from "../models/eventSubscription.model";
import { UserModel } from "../models/user.model";
import { EventModel } from "../models/event.model";

class EventSubscriptionRepository {
  protected model = EventSubscriptionModel;
  
  async getAll<R = IEventSubscription>(
    queryParams: Omit<IQueryStringParams, "cursor">
  ): Promise<R[]> {
    const sequelizeQuery = generateSequelizeQuery(queryParams);
    
    const response = await this.model.findAll({
      // attributes: [
      //   "event_id",
      //   [Sequelize.fn("COUNT", Sequelize.col("event_id")), "subscriberCount"]
      // ],
      // group: ["event_id"],
      ...sequelizeQuery
    });

    return getDataArray(response);
  }

  async subscribe(data: IEventSubscription): Promise<IEventSubscription> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
  
    try {
      // Check if the user exists
      const user = await UserModel.findByPk(data.user_id, { transaction });
      if (!user) {
        throw new Error("User not found.");
      }
  
      // Check if the event exists
      const event = await EventModel.findByPk(data.event_id, { transaction });
      if (!event) {
        throw new Error("Event not found.");
      }
  
      // Check if the subscription already exists
      const existingSubscription = await this.model.findOne({
        where: {
          user_id: data.user_id,
          event_id: data.event_id,
        },
        transaction,
      });
  
      if (existingSubscription) {
        throw new Error("User is already subscribed to this event.");
      }
  
      // Create a new subscription entry in the UserEventModel table
      const subscription = await EventSubscriptionModel.create(
        {
          user_id: data.user_id,
          event_id: data.event_id,
        },
        { transaction }
      );
  
      await transaction.commit();
  
      return subscription.get(); // Return the created subscription data
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async unsubscribe(data: IEventSubscription): Promise<void> {
    const transaction: Transaction = await this.model.sequelize!.transaction();
    try {
      // Check if the subscription exists
      const existingSubscription = await EventSubscriptionModel.findOne({
        where: {
          user_id: data.user_id,
          event_id: data.event_id,
        },
        transaction,
      });
  
      if (!existingSubscription) {
        throw new Error("Subscription not found.");
      }
  
      // Delete the subscription entry
      await existingSubscription.destroy({ transaction });
  
      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }  
}

export const eventSubscriptionRepository = Object.freeze(new EventSubscriptionRepository());