import type { NextApiRequest, NextApiResponse } from "next";
import { Resend } from "resend";
import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import { RouteTemplate } from "~/apps/email/route-template";
import RoutingMagicLink from "~/services/email/components/send-routes";

const resend = new Resend(process.env.NEXT_PUBLIC_RESEND_API_KEY);

const routeHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== "POST") {
    res.status(405).send("Method Not Allowed");
  }

  try {
    const { emailBundles } = req.body;

    if (!emailBundles || emailBundles.length === 0) {
      res.status(400).json("Invalid email bundles");
    }

    const data = await Promise.all(
      emailBundles.map(
        async (bundle: { email: string; url: string; passcode: string }) => {
          const emailData = await resend.emails.send({
            from: "Artisanal Futures Routing <routing@artisanalfutures.org>",
            to: [bundle.email],
            subject: `New Route Assignment for Solidarity Pathways`,
            react: RoutingMagicLink({
              loginCode: bundle.passcode,
              url: bundle.url,
            }),
          } as CreateEmailOptions);
          return emailData;
        }
      )
    );

    // const data = await resend.emails.send({
    //   from: "Artisanal Futures Routing <routing@artisanalfutures.org>",
    //   to: [email],
    //   subject: `New Route Assignment for Solidarity Pathways`,
    //   react: RoutingMagicLink({ loginCode: body }),
    // } as CreateEmailOptions);

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default routeHandler;
