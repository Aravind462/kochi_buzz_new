import { IBaseAttributes } from "../types.sql";

export interface IEventSubscription extends IBaseAttributes {
    user_id?: number,
    event_id: number,
    subscriberCount?: number
}