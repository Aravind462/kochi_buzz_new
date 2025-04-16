import { AbstractServices } from "./AbstractService";
import { IEvent } from "@repo/types/lib/schema/event";
import { IAPIV1Response } from "@repo/types/lib/types";
import { IEventSubscription } from "@repo/types/lib/schema/eventSubscription"
import { APIError } from "@repo/frontend/errors/APIError";

class EventSubscriptionService extends AbstractServices<IEvent> {
  constructor() {
    super("/events");
  }

  getAllSubscription = async (params?: Record<string, any>): Promise<IEventSubscription[]> => {
    try {
      const response = await this.http.get<IAPIV1Response<IEventSubscription[]>>("/subscriptions", { params });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new APIError(response.data as IAPIV1Response);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };

  subscribe = async (eventId: number, userId: number): Promise<void> => {
    try {
      const response = await this.http.post<IAPIV1Response> (`/${eventId}/subscriptions`, { userId });
  
      if (!response.data.success) {
        throw new APIError(response.data);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };
  
  unsubscribe = async (eventId: number, userId: number): Promise<void> => {
    try {
      const response = await this.http.delete<IAPIV1Response>(`/${eventId}/subscriptions`, {
        headers: { 'Content-Type': 'application/json' },
        data: { userId },
      });
  
      if (!response.data.success) {
        throw new APIError(response.data);
      }
    } catch (error) {
      throw this.apiError(error);
    }
  };
  
}

export const eventSubscriptionService = new EventSubscriptionService();
