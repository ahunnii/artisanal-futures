import { toast } from "react-hot-toast";
import type { NotificationProcessor } from "../factory";

export const HotToastNotificationProcessor: NotificationProcessor = {
  notifySuccess: ({ message }) => {
    return toast.success(message);
  },

  notifyError: ({ error, message }) => {
    console.error("Notification Error:", error);
    return toast.error(message);
  },

  notifyInfo: ({ message }) => {
    return toast(message);
  },

  notifyResults: ({ message }) => {
    return toast(message);
  },
};
