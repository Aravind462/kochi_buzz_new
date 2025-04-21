import { IAPIV1Response } from "@repo/types/lib/types";
import { AbstractServices } from "./AbstractService";
import { IEvent } from "@repo/types/lib/schema/event";
import { APIError } from "@repo/frontend/errors/APIError";

class EventServices extends AbstractServices<IEvent> {
  constructor() {
    super("/events");
  }

  getNearbyEvents = async (data: { latitude: number, longitude: number }): Promise<IEvent[]> => {
    console.log(data);
    
    try {
      const response = await this.http.post<IAPIV1Response<IEvent[]>>("/nearby", data);

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  getAllEvents = async (params?: Record<string, any>): Promise<IEvent[]> => {
    try {
      const response = await this.http.get<IAPIV1Response<IEvent[]>>("/", { params });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  // getEventById = async (): Promise<IEvent> => {
  //   try {
  //     const response = await this.http.get<IAPIV1Response<IEvent>>("/:id");

  //     if (response.data.success) {
  //       return response.data.data;
  //     } else {
  //       throw new APIError(response.data as IAPIV1Response);
  //     }
  //   } catch (error) {
  //     throw this.apiError(error);
  //   }
  // };
  
}

export const eventServices = Object.freeze(new EventServices());