import { IBaseServices } from "@repo/backend/lib/services/IBaseServices";
import { IEventSubscription } from "@repo/types/lib/schema/eventSubscription";
import { IQueryStringParams } from "@repo/types/lib/types";
import { eventSubscriptionRepository } from "../repositories/eventSubscription.repository";

class EventSubscriptionService {
  async getAll(query: IQueryStringParams): Promise<IEventSubscription[]> {
    return eventSubscriptionRepository.getAll(query);
  }

  async subscribe(event_id: number, user_id: number): Promise<IEventSubscription> {
    return eventSubscriptionRepository.subscribe({user_id, event_id});
  }

  async unsubscribe(event_id: number, user_id: number): Promise<void> {
    return eventSubscriptionRepository.unsubscribe({user_id, event_id});
  }
}

export const eventSubscriptionService = Object.freeze(new EventSubscriptionService());