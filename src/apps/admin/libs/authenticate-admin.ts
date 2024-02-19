import type { GetServerSidePropsContext } from "next";
import {
  authenticateUser,
  redirectIfNoSession,
  redirectIfUnauthorized,
} from "~/utils/auth";
import { checkIfAdmin } from "./check-if-admin";

export const authenticateAdminServerSide = async (
  ctx: GetServerSidePropsContext
) => {
  const user = await authenticateUser(ctx);
  if (!user) return redirectIfNoSession(ctx.resolvedUrl);

  const isAdmin = checkIfAdmin(user);
  if (!isAdmin) return redirectIfUnauthorized();

  return { props: {} };
};
