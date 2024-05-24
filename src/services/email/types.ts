import type { FC } from "react";

export type EmailTemplate = {
  from: string;
  to?: string;
  subject: (name: string) => string;
  Template: FC<Readonly<EmailData>>;
};

export type EmailTemplateMap = {
  [key in Email]: EmailTemplate;
};

export type Email = "newRoute" | "default";

export type EmailData = {
  email: string;
  name: string;
  body: string;
};

export type RouteEmailData = {
  email: string;
  loginCode: string;
  url: string;
};

export type TEmailService<Client> = {
  sendEmail: <T extends EmailData>({
    data,
    type,
  }: {
    data: T;
    type: Email;
  }) => Promise<unknown>;
  client: Client;
};
