import { getAuth } from "@clerk/nextjs/server";
import type { GetServerSidePropsContext } from "next";

import { prisma } from "~/server/db";

export const authenticateSession = async (ctx: GetServerSidePropsContext) => {
  const { userId } = getAuth(ctx.req);

  if (!userId) {
    return {
      redirect: {
        destination: "/sign-in?redirect_url=" + ctx.resolvedUrl,
        permanent: false,
      },
    };
  }

  const shop = await prisma.shop.findFirst({
    where: {
      id: ctx.query.shopId as string,
      ownerId: userId,
    },
  });

  return shop;
};
