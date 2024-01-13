import type { GetServerSidePropsContext } from "next";
import { getServerSession, type Session } from "next-auth";
import { checkIfAdmin } from "~/apps/admin/libs/check-if-admin";
import { authOptions } from "~/server/auth";

export const authenticateSession = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return redirectIfNoSession(ctx.resolvedUrl);
  return session;
};

export const authenticateUser = async (ctx: GetServerSidePropsContext) => {
  const session = (await authenticateSession(ctx)) as Session;
  // if (!session.user) return redirectIfNoSession(ctx.resolvedUrl);
  if (!session.user) return null;
  return session.user;
};

// export const authenticateAdmin = async (ctx: GetServerSidePropsContext) => {
//   const user = await authenticateUser(ctx);

//   if (!checkIfAdmin(user)) {
//     return redirectIfUnauthorized();
//   }

//   return user;
// };

export const redirectIfUnauthorized = () => {
  return {
    redirect: {
      destination: "/unauthorized",
      permanent: false,
    },
  };
};

export const redirectIfNoSession = (resolvedUrl: string) => {
  return {
    redirect: {
      destination: "/sign-in?redirect_url=" + resolvedUrl,
      permanent: false,
    },
  };
};
