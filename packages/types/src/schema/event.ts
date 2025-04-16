import { IBaseAttributes } from "../types.sql";

export interface IEvent extends IBaseAttributes {
    title: string,
    description: string,
    from_date: Date,
    from_time: string,
    to_date: Date,
    to_time: string,
    venue: string,
    location: string,
    category: string,
    price: number,
    organizer_id: number,
    status: string,
    reports?: Array<{ report: string, user_id: number }>
}
