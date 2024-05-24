// import { SignIn } from "@clerk/nextjs";
import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from "next";
import { getServerSession } from "next-auth";

import { getProviders, signIn } from "next-auth/react";
import Head from "next/head";
import Image from "next/image";
import { Button } from "~/components/ui/button";
import { env } from "~/env.mjs";

import AuthLayout from "~/layouts/auth-layout";
import { authOptions } from "~/server/auth";
const SignUpPage = ({
  providers,
  error,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => (
  <>
    <Head>
      <title>Artisanal Futures</title>
      <meta name="description" content="Generated by create-t3-app" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <AuthLayout>
      <div className=" my-auto flex h-full w-full items-center gap-5">
        <div className="justify-left flex w-4/12">
          <div className="w-96 rounded-lg border bg-white p-8 shadow">
            {error && (
              <p className="text-center font-semibold text-red-700">{error}</p>
            )}
            <h1 className="mb-4 text-center text-3xl font-semibold">
              Sign Up for Artisanal Futures
            </h1>
            <p className="text-center text-muted-foreground">
              Sign into your platform of choice to create an account.
            </p>
            <br />
            <div className="flex flex-col gap-y-2">
              {Object.values(providers).map((provider) => {
                if (provider.name !== "Auth0") {
                  return (
                    <div key={provider.name}>
                      <Button
                        onClick={() => void signIn(provider.id)}
                        variant={"outline"}
                        className="flex w-full justify-center gap-x-5 rounded-full"
                      >
                        {" "}
                        <Image
                          src={`/img/${provider.id}.svg`}
                          width={25}
                          height={25}
                          alt={provider.name}
                        />
                        Sign up with {provider.name}
                      </Button>
                    </div>
                  );
                }
              })}

              <div className="my-3 flex items-center px-3">
                <hr className="w-full border-slate-600" />
                <span className="mx-3 text-slate-500">or</span>
                <hr className="w-full border-slate-600" />
              </div>

              <div>
                <Button
                  onClick={() =>
                    void signIn(
                      "auth0",
                      {
                        callbackUrl:
                          env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
                      },
                      { screen_hint: "signup" }
                    )
                  }
                  variant={"outline"}
                  className="w-full rounded-full"
                >
                  Sign up with email using Auth0
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className=" flex w-8/12 justify-end  ">
          <Image
            src="/welcome.svg"
            alt="under development"
            width={500}
            height={500}
          />
        </div>
      </div>
    </AuthLayout>
  </>
);
export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // If the user is already logged in, redirect.
  // Note: Make sure not to redirect to the same page
  // To avoid an infinite loop!
  if (session) {
    return { redirect: { destination: "/" } };
  }

  const isLoggedIn = context.req.cookies.login;

  const urlCode = context.query?.code;

  if (!isLoggedIn && !urlCode)
    return { redirect: { destination: "/password-protect" } };

  if (urlCode) {
    const codeRes = await fetch(`${env.NEXTAUTH_URL}/api/password-protect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password: urlCode }),
    }).then((res) => res.json());

    if (!codeRes.success) {
      return { redirect: { destination: "/password-protect" } };
    }
  }

  const providers = await getProviders();
  const errorMessage: Record<string, string> = {
    OAuthCallback: "Oops, something went wrong there. Please try again later.",
    OAuthAccountNotLinked:
      "The email associated with your selected provider is already in use. Please try another provider or contact us.",
  };

  const error = context.query.error
    ? errorMessage[(context.query.error as string) ?? "OAuthCallback"]
    : null;
  return {
    props: { providers: providers ?? [], error: error },
  };
}
export default SignUpPage;
