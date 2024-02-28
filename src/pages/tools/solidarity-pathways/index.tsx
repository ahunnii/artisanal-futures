import { useEffect } from "react";

import { type GetServerSidePropsContext } from "next";

import { useDepotModal } from "~/apps/solidarity-routing/hooks/depot/use-depot-modal.wip";

import GroupingMap from "~/apps/solidarity-routing/components/group/road-map";

import RouteLayout from "~/apps/solidarity-routing/components/layout/route-layout";
import { DepotModal } from "~/apps/solidarity-routing/components/settings/depot-modal";
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

  return (
    <>
    <GroupingMap />
    </>
  );
};

export default SolidarityPathwaysHomePage;
