import type { RouteEmailData } from "./types";

type SendEmailProps<T> = {
  data: T;
  //   type: Email;
};

export interface EmailProcessor<Client> {
  client: Client;
  //   sendEmail<T extends EmailData>({
  //     data,
  //     type,
  //   }: SendEmailProps<T>): Promise<unknown>;
  sendRoute<T extends RouteEmailData>({
    data,
  }: // type,
  SendEmailProps<T>): Promise<unknown>;
}

export class EmailService<Client> {
  constructor(private service: EmailProcessor<Client>) {}

  client: Client = this.service.client;
  //   sendEmail = async <T extends EmailData>(props: SendEmailProps<T>) => {
  //     return this.service.sendEmail(props);
  //   };
  sendRoute = async <T extends RouteEmailData>(props: SendEmailProps<T>) => {
    return this.service.sendRoute(props);
  };
}
