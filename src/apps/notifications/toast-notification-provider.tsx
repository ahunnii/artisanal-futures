import { Toaster as HotToast } from "react-hot-toast";
import { Toaster as SonnerToaster } from "~/components/ui/sonner";
import { Toaster } from "~/components/ui/toaster";
// import {
//   NotificationService,
//   sonnarToast,
// } from "./services/notification-abstract";

export default function ToastNotificationProvider() {
  // const notificationService = new NotificationService(sonnarToast);

  // const params = notificationService.getToastParams();
  return (
    <>
      {" "}
      <SonnerToaster richColors theme="light" />
      <HotToast />
      <Toaster />
    </>
  );
}
