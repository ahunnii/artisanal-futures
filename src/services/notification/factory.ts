import type { PromiseMessage } from "./types";

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
  notifyResults: ({
    message,
    data,
  }: {
    message: string;
    data: unknown;
  }) => void;

  notifyPending: (
    promise: Promise<PromiseMessage>,
    props: {
      isLoading?: boolean;
      error?: unknown;
      successMessage?: string;
      loadingMessage?: string;
      errorMessage?: string;
    }
  ) => void;
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

  notifyResults = ({ message, data }: { message: string; data: unknown }) => {
    return this.service.notifyResults({ message, data });
  };
  notifyPending = (
    promise: Promise<PromiseMessage>,
    props: {
      isLoading?: boolean;
      error?: unknown;
      successMessage?: string;
      loadingMessage?: string;
      errorMessage?: string;
    }
  ) => {
    return this.service.notifyPending(promise, props);
  };
}
