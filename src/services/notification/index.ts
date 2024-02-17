import { NotificationService } from "./factory";
import { availableNotificationProcessors } from "./processors/available";

const selectedNotificationProcessor =
  availableNotificationProcessors[
    "hotToast" as keyof typeof availableNotificationProcessors
  ];

export const notificationService = new NotificationService(
  selectedNotificationProcessor
);
