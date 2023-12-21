import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import { RouteTemplate } from "~/components/email/route-template";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const routeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const { email, body } = req.body;

    const id = body.split("/").pop();
    const data = await resend.emails.send({
      from: "Artisanal Futures Routing <routing@artisanalfutures.org>",
      to: [email],
      subject: `New Route Assigned - ${id}`,
      react: RouteTemplate({ message: body }),
    } as CreateEmailOptions);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default routeHandler;
