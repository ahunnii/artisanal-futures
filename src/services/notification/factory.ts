export interface NotificationProcessor {
  notifySuccess: ({ message }: { message: string }) => void;
  notifyError: ({
    error,
    message,
  }: {
    error: unknown;
    message: string;
  }) => void;

  notifyInfo: ({ message }: { message: string }) => void;
  notifyResults: ({ message }: { message: string }) => void;
}

export class NotificationService {
  constructor(private service: NotificationProcessor) {}

  notifySuccess = ({ message }: { message: string }) => {
    return this.service.notifySuccess({ message });
  };

  notifyError = ({ error, message }: { error: unknown; message: string }) => {
    return this.service.notifyError({ error, message });
  };

  notifyInfo = ({ message }: { message: string }) => {
    return this.service.notifyInfo({ message });
  };

  notifyResults = ({ message }: { message: string }) => {
    return this.service.notifyResults({ message });
  };
}
