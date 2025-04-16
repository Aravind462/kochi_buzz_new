import { IBaseAttributes } from "../types.sql";

export interface INotification extends IBaseAttributes {
    user_id: number,
    event_id: number,
    type: string,
    is_read?: boolean
}
