import { HotToastService } from "../services/hot-toast-service";
import { NotificationService } from "../services/notification-abstract";
import { ShadcnToastService } from "../services/shadcn-service";

export const toast = new NotificationService(HotToastService);
