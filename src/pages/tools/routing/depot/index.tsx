import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "~/server/db";

import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

import { DepotModal } from "~/components/tools/routing/ui/depot-modal";
import { useDepotModal } from "~/hooks/routing/use-depot-modal";
import ToolLayout from "~/layouts/tool-layout";

const DepotDashboardPage = ({ shop }) => {
  const onOpen = useDepotModal((state) => state.onOpen);
  const isOpen = useDepotModal((state) => state.isOpen);

  useEffect(() => {
    // if (!isOpen) {
    onOpen();
    // }
  }, [onOpen]);

  return (
    <>
      <DepotModal shop={shop} />
    </>
  );
};

export async function getServerSideProps(ctx: GetServerSidePropsContext) {
  const session = await getServerAuthSession(ctx);

  if (!session || !session.user) {
    return {
      props: {},
    };
  }

  const depot = await prisma.depot.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });

  //   if (depot) {
  //     console.log("yeet");
  //     const deletedDepot = await prisma.routeDepot.delete({
  //       where: {
  //         id: depot.id,
  //         ownerId: session.user.id,
  //       },
  //     });

  //     console.log("deleted depot", deletedDepot);
  //   }

  const shop = await prisma.shop.findFirst({
    where: {
      ownerId: session.user.id,
    },
  });

  if (depot) {
    console.log("redirecting to depot", depot.id);

    return {
      redirect: {
        destination: `/tools/routing/depot/${depot.id as string}`,
        permanent: false,
      },
    };
  }

  return {
    props: {
      shop: shop
        ? {
            ...shop,
            createdAt: shop.createdAt.toISOString(),
            updatedAt: shop.updatedAt.toISOString(),
          }
        : null,
    },
  };
}

export default DepotDashboardPage;
