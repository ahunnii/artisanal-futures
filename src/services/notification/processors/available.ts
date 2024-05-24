import { HotToastNotificationProcessor } from "./hot-toast";
import { SonnerNotificationProcessor } from "./sonner-toast";

export const availableNotificationProcessors = {
  hotToast: HotToastNotificationProcessor,
  sonnerToast: SonnerNotificationProcessor,
};
