import { IAPIV1Response } from "@repo/types/lib/types";
import { AbstractServices } from "./AbstractService";
import { INotification } from "@repo/types/lib/schema/notification";
import { APIError } from "@repo/frontend/errors/APIError";

class NotificationServices extends AbstractServices<INotification> {
  constructor() {
    super("/notifications");
  }
  
  bulkCreate = async (data: INotification[]): Promise<INotification[]> => {
    try {
      const response = await this.http.post<IAPIV1Response<INotification[]>>("/bulk", data);
  
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };
}

export const notificationServices = Object.freeze(new NotificationServices());