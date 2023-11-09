import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";
import { InquiryTemplate } from "~/components/email/inquiry-template";
import { JoinTemplate } from "~/components/email/join-template";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const inviteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const { email } = req.body;
    const data = await resend.emails.send({
      from: "Artisanal Futures <team@artisanalfutures.org>",
      to: email,
      subject: "You are invited to join Artisanal Futures!",
      react: JoinTemplate(),
    } as CreateEmailOptions);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default inviteHandler;
