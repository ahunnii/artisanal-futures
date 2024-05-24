import { NotificationService } from "./factory";
import { availableNotificationProcessors } from "./processors/available";

const selectedNotificationProcessor =
  availableNotificationProcessors[
    "sonnerToast" as keyof typeof availableNotificationProcessors
  ];

export const notificationService = new NotificationService(
  selectedNotificationProcessor
);
