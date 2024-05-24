import type { NextApiRequest, NextApiResponse } from "next";

import { emailService } from "~/services/email";

const sendRouteHandler = async (req: NextApiRequest, res: NextApiResponse) => {
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
          const emailData = await emailService.sendRoute({
            data: {
              email: bundle.email,
              loginCode: bundle.passcode,
              url: bundle.url,
            },
          });

          return emailData;
        }
      )
    );

    res.status(200).json(data);
  } catch (error) {
    res.status(400).json(error);
  }
};
export default sendRouteHandler;
