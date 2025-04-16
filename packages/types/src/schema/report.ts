import { IBaseAttributes } from "../types.sql";

export interface IReport extends IBaseAttributes {
    user_id: number,
    event_id: number,
    report: string
}
