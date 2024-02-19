import type { GetServerSidePropsContext } from "next";
import { getServerSession, type Session, type User } from "next-auth";
import { checkIfAdmin } from "~/apps/admin/libs/check-if-admin";
import {
  redirectIfNoSession,
  redirectIfNotSignedIn,
  redirectIfUnauthorized,
} from "~/utils/authentication/redirects";

import { authOptions } from "~/server/auth";

export const authenticateUserServerSide = async (
  ctx: GetServerSidePropsContext,
  additional?: (user: User, ctx?: GetServerSidePropsContext) => unknown
) => {
  const user = await authenticateUser(ctx);
  if (!user) return redirectIfNotSignedIn(ctx.resolvedUrl);

  if (additional) return additional(user, ctx);

  return { props: {} };
};

export const authenticateAdminServerSide = async (
  ctx: GetServerSidePropsContext
) => {
  const handleAdminVerification = (user: User) => {
    const isAdmin = checkIfAdmin(user);
    if (!isAdmin) return redirectIfUnauthorized();
  };

  return authenticateUserServerSide(ctx, handleAdminVerification);
};

export const authenticateSession = async (ctx: GetServerSidePropsContext) => {
  const session = await getServerSession(ctx.req, ctx.res, authOptions);
  if (!session) return redirectIfNoSession(ctx.resolvedUrl);
  return session;
};

export const authenticateUser = async (ctx: GetServerSidePropsContext) => {
  const session = (await authenticateSession(ctx)) as Session;
  if (!session.user) return null;
  return session.user;
};
