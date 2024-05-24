import { type GetServerSidePropsContext } from "next";

import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

const DepotHomePage = () => {
  return <></>;
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/tools/solidarity-pathways/sandbox",
        permanent: false,
      },
    };
  }

  const userId = session.user.id;

  const depot = await prisma.depot.findUnique({
    where: {
      ownerId: userId,
      id: ctx.params?.depotId as string,
    },
  });

  if (depot)
    return {
      redirect: {
        destination: `/tools/solidarity-pathways/${depot.id.toString()}/overview`,
        permanent: false,
      },
    };

  return {
    redirect: {
      destination: `/tools/solidarity-pathways/`,
      permanent: false,
    },
  };
}

export default DepotHomePage;
