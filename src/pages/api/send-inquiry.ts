import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { InquiryTemplate } from "~/apps/email/inquiry-template";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const inquiryHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, body } = req.body;
    const data = await resend.emails.send({
      from: "Inquiry <team@artisanalfutures.org>",
      to: "artisanalfutures@gmail.com",
      subject: "New Inquiry",
      react: InquiryTemplate({ fullName: name, message: body, email }),
    } as CreateEmailOptions);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default inquiryHandler;
