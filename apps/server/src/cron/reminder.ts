import { Op } from "sequelize";
import { EventModel } from "../models/event.model";
import { EventSubscriptionModel } from "../models/eventSubscription.model";
import { NotificationModel } from "../models/notification.model";
import { INotification } from "@repo/types/lib/schema/notification";

export async function sendReminderNotifications() {
  const now = new Date();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

  const upcomingEvents = await EventModel.findAll({
    where: {
      from_date: {
        [Op.between]: [now, in24Hours],
      },
    },
  });

  for (const event of upcomingEvents) {
    const subscriptions = await EventSubscriptionModel.findAll({
      where: { event_id: event.id },
    });

    const notifications: INotification[] = [];

    for (const sub of subscriptions) {
      const alreadyExists = await NotificationModel.findOne({
        where: {
          user_id: sub.user_id,
          event_id: event.id,
          type: "reminder",
        },
      });

      if (!alreadyExists) {
        notifications.push({
          user_id: sub.user_id,
          event_id: event.id,
          type: "reminder",
          is_read: false,
          created_at: new Date(),
        });
      }
    }

    if (notifications.length > 0) {
      await NotificationModel.bulkCreate(notifications as any[]);
    }
  }

  console.log("✅ Reminder notifications sent");
}