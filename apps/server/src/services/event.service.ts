import { IBaseServices } from "@repo/backend/lib/services/IBaseServices";
import { IEvent } from "@repo/types/lib/schema/event";
import { IQueryStringParams } from "@repo/types/lib/types";
import { eventRepository } from "../repositories/event.repository";
import { IEventSubscription } from "@repo/types/lib/schema/eventSubscription";

class EventService {
  async create(data: IEvent): Promise<IEvent> {
    return eventRepository.create(data);
  }

  async getAll(query: IQueryStringParams): Promise<IEvent[]> {
    return eventRepository.getAll(query);
  }

  async getById(id: number): Promise<IEvent | null> {
    return eventRepository.getById(id);
  }

  async getNearby(data: { latitude: number; longitude: number }): Promise<IEvent| null> {
    return eventRepository.getNearby(data);
  }

  async update(id: number, data: IEvent): Promise<IEvent | null> {
    return eventRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return eventRepository.delete(id);
  }

}

export const eventService = Object.freeze(new EventService());