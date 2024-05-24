import { toast } from "sonner";
import { ScrollArea } from "~/components/ui/scroll-area";
import type { NotificationProcessor } from "../factory";

export const SonnerNotificationProcessor: NotificationProcessor = {
  notifySuccess: ({ message }) => {
    return toast.success(message, {
      position: "top-center",
    });
  },

  notifyError: ({ error, message }) => {
    console.error("Notification Error:", error);
    return toast.error(message, {
      position: "top-center",
    });
  },

  notifyInfo: ({ message }) => {
    return toast(message);
  },

  notifyResults: ({ message, data }) => {
    return toast(message, {
      description: (
        <ScrollArea className="z-50 mt-2 flex  h-[200px] w-full overflow-scroll rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </ScrollArea>
      ),
    });
  },

  notifyPending: (promise, props) => {
    //create a promise that resolves when isLoading is false

    return toast.promise(promise, {
      position: "top-center",
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
    });
  },
};
