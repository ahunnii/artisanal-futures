import type { CreateEmailOptions } from "resend/build/src/emails/interfaces";

import NewRouteTemplate from "../../email-templates/new-route-template";
import type { EmailProcessor } from "../../factory";
import type { Email, RouteEmailData } from "../../types";
import { resendClient } from "./client";

type SendEmailProps<T> = {
  data: T;
  type: Email;
};

export const ResendEmailService: EmailProcessor<typeof resendClient> = {
  client: resendClient,

  sendRoute: async <T extends RouteEmailData>({ data }: SendEmailProps<T>) => {
    const { email, loginCode, url } = data;
    const res = await resendClient.emails.send({
      from: "Artisanal Futures <no-reply@artisanalfutures.org>",
      to: email,
      subject: "New Route Assignment from Solidarity Pathways",
      react: NewRouteTemplate({
        loginCode,
        url,
      }),
    } as CreateEmailOptions);

    return res;
  },
};
