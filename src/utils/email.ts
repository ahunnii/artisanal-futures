import axios from "axios";

type TEmailProps = {
  email: string | undefined;
  endpoint: string;
  message: string;
  success: () => void;
  error: (err: unknown) => void;
};
export const sendEmail = async ({
  email,
  endpoint,
  message,
  success,
  error,
}: TEmailProps) => {
  if (!email) return;

  const res = await axios.post(endpoint, {
    email,
    body: message,
  });

  if (res.data.id) success();
  else error(res.data);
};
