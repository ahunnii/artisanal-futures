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

  notifyPending: (promise, props) => {
    //create a promise that resolves when isLoading is false

    return void toast.promise(
      promise,
      {
        loading: props.loadingMessage ?? "Loading...",
        success: (data) => {
          return data.message ?? props.successMessage ?? "Success!";
        },
        error: (data) => {
          console.error("Notification Error:", data?.error);
          return (
            data.message ??
            props.errorMessage ??
            "An error has occurred. Please try again later."
          );
        },
      },
      {
        position: "top-center",
      }
    );
  },
};
