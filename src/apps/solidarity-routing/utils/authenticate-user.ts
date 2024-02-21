import type { GetServerSidePropsContext } from "next";
import { prisma } from "~/server/db";
import {
  authenticateUser,
  redirectIfNoSession,
  redirectIfUnauthorized,
} from "~/utils/auth";

export const authenticateRoutingServerSide = async (
  ctx: GetServerSidePropsContext,
  allowForDriver?: boolean,
  conditional?: (ctx: GetServerSidePropsContext) => unknown
) => {
  // const driverCookie = ctx.req.cookies?.verifiedDriver;
  // if (allowForDriver)
  //   return { props: { verifiedDriver: driverCookie !== undefined } };

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
};
