import { useEffect } from "react";

import { type GetServerSidePropsContext } from "next";

import { useDepotModal } from "~/apps/solidarity-routing/hooks/use-depot-modal.wip";

import { DepotModal } from "~/apps/solidarity-routing/components/depot/depot-modal.wip";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

const SolidarityPathwaysHomePage = () => {
  const onOpen = useDepotModal((state) => state.onOpen);
  const isOpen = useDepotModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return <DepotModal initialData={null} />;
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

  const depot = await prisma.depot.findFirst({
    where: {
      ownerId: userId,
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
    props: {},
  };
}

export default SolidarityPathwaysHomePage;
