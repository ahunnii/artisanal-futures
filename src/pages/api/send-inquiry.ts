import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import { InquiryTemplate } from "~/components/email/inquiry-template";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const { name, email, body } = req.body;
    const data = await resend.emails.send({
      from: "Acme <onboarding@resend.dev>",
      to: [email],
      subject: "Hello world",
      react: InquiryTemplate({ fullName: name, message: body }),
    });

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
