import { AbstractServices } from "./AbstractService";
import { INotification } from "@repo/types/lib/schema/notification";

class NotificationServices extends AbstractServices<INotification> {
  constructor() {
    super("/notifications");
  }
}

export const notificationServices = Object.freeze(new NotificationServices());