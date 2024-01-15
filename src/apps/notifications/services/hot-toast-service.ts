import { toast } from "react-hot-toast";

export const HotToastService = {
  success: (message: string) => toast.success(message),
  error: (message: string, error: unknown) => {
    toast.error(message);
    console.log(error);
  },
  info: (message: string) => toast(message),
};
