import type { GetServerSidePropsContext } from "next";
import { prisma } from "~/server/db";
import {
  authenticateSession,
  authenticateUser,
  redirectIfNoSession,
  redirectIfUnauthorized,
} from "~/utils/auth";

// const authenticateUser = async (ctx: GetServerSidePropsContext) => {
//   const session = (await authenticateSession(ctx)) as Session;
//   const user = session;
//   console.log(user);
//   // if (!session.user) return redirectIfNoSession(ctx.resolvedUrl);
//   if (!session.user) return null;
//   return session.user;
// };

export const authenticateRoutingServerSide = async (
  ctx: GetServerSidePropsContext,
  allowForDriver?: boolean,
  conditional?: (ctx: GetServerSidePropsContext) => unknown
) => {
  const token = ctx.req.cookies?.verifiedDriver;
  if (allowForDriver && token)
    return {
      props: {
        verifiedDriver: true,
      },
    };

  if (allowForDriver && !token)
    return {
      props: {
        verifiedDriver: false,
      },
    };

  if (!allowForDriver) {
    const user = await authenticateUser(ctx);

    const query = ctx.query;

    if (user?.role === "DRIVER") return redirectIfUnauthorized();
    if (!user) return redirectIfNoSession(ctx.resolvedUrl);

    const depot = await prisma.depot.findUnique({
      where: { id: query.depotId as string },
    });

    if (!depot)
      return {
        redirect: {
          destination: "/tools/solidarity-pathways",
          permanent: false,
        },
      };

    const isOwner = user.id === depot.ownerId;

    if (!isOwner) return redirectIfUnauthorized();

    if (conditional) return conditional(ctx);

    return { props: {} };
  }
};
