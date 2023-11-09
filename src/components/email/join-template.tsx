import { Terminal } from "lucide-react";

import * as React from "react";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";
import { env } from "~/env.mjs";

import Container from "../ui/container";

export const JoinTemplate = () => (
  <Container>
    <h1 className="mx-0 my-[30px] p-0 text-center text-[24px] font-normal text-black">
      Join <strong>Artisanal Futures</strong>
    </h1>
    <h1>Hey!</h1>

    <p>
      You are invited to join <strong>Artisanal Futures</strong>. What is{" "}
      <strong>Artisanal Futures</strong>? It is a web platform for research on
      grassroots economic support systems.{" "}
    </p>

    <p>
      Here is how you join. First, head to{" "}
      <a href="https://www.artisanalfutures.org/sign-up">
        https://www.artisanalfutures.org/sign-up
      </a>
      . Once there, you will be prompted to enter a password.
    </p>

    <Alert>
      <Terminal className="h-4 w-4" />
      <AlertTitle>The password is:</AlertTitle>
      <AlertDescription className="italic">
        {env.NEXT_PUBLIC_PASSWORD_PROTECT}
      </AlertDescription>
    </Alert>

    <p>
      From there, you will see our available sign up options You are able to
      sign in with your existing Google account, as well as create a new account
      with your email address. If you have any questions, please reach out to us
      at{" "}
      <a href="mailto:artisanalfutures@gmail.com">artisanalfutures@gmail.com</a>
    </p>

    <hr className="mx-0 my-[26px] w-full border border-solid border-[#eaeaea]" />
    <p className="text-[12px] leading-[24px] text-[#666666]">
      This invitation was auto generated from an admin user on Artisanal
      Futures. Do not respond to this email. Contact us as{" "}
      <a href="mailto:artisanalfutures@gmail.com">artisanalfutures@gmail.com</a>{" "}
      if you have any questions or concerns.
    </p>
  </Container>
);
