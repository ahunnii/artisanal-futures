type TNotificationService = {
  success: (message: string) => void;
  error: (message: string, error?: unknown) => void;
  info: (message: string) => void;
};
export class NotificationService {
  constructor(private toast: TNotificationService) {}

  //Implement success method
  success(message: string) {
    this.toast.success(message);
  }

  //Implement error method
  error(message: string, error?: unknown) {
    this.toast.error(message);
    console.log(error);
  }

  //Implement inform method
  info(message: string) {
    this.toast.info(message);
  }
}
