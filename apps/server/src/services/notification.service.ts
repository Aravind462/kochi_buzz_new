import { INotification } from "@repo/types/lib/schema/notification";
import { IQueryStringParams } from "@repo/types/lib/types";
import { notificationRepository } from "../repositories/notification.repository";

class NotificationService {
  async create(data: INotification): Promise<INotification> {
    return notificationRepository.create(data);
  }

  async bulkCreate(data: INotification[]): Promise<INotification[]> {
    return notificationRepository.bulkCreate(data);
  }

  async getAll(query: IQueryStringParams): Promise<INotification[]> {
    return notificationRepository.getAll(query);
  }

  async getById(id: number): Promise<INotification | null> {
    return notificationRepository.getById(id);
  }

  async update(id: number, data: INotification): Promise<INotification | null> {
    return notificationRepository.update(id, data);
  }

  async delete(id: number): Promise<void> {
    return notificationRepository.delete(id);
  }
}

export const notificationService = Object.freeze(new NotificationService());