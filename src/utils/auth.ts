import type { GetServerSidePropsContext } from "next";
import { getServerSession, type Session } from "next-auth";
import { authOptions } from "~/server/auth";

export const authenticateSession = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }

  return session;
};

export const authenticateUser = async (ctx: GetServerSidePropsContext) => {
  const session = (await authenticateSession(ctx)) as Session;

  if (!session.user) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: session.user,
    },
  };
};
