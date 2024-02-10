/* eslint-disable react-hooks/exhaustive-deps */

import dynamic from "next/dynamic";

import React, { useEffect, useState, type FC } from "react";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";

import { Beforeunload } from "react-beforeunload";

import type { RouteData, StepData } from "~/apps/solidarity-routing/types";
import { Button } from "~/components/ui/button";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

import { useParams, useSearchParams } from "next/navigation";

import StopDetails from "~/apps/solidarity-routing/components/tracking/stop-details";

import Head from "next/head";
import LoadingIndicator from "~/apps/solidarity-routing/components/solutions/loading-indicator";

import { useDriverRoute } from "~/apps/solidarity-routing/hooks/use-driver-routes";
import useRealTime from "~/apps/solidarity-routing/hooks/use-realtime";
import PageLoader from "~/components/ui/page-loader";
import { ScrollArea } from "~/components/ui/scroll-area";
import RouteLayout from "~/layouts/route-layout";

import { GetServerSidePropsContext } from "next";
import DriverRouteBreakdown from "~/apps/solidarity-routing/components/solutions/driver-route-breakdown";

import RouteBreakdown from "~/apps/solidarity-routing/components/ui/cards/route-breakdown";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "~/apps/solidarity-routing/hooks/optimized-data/use-optimized-route-plan";
import { getColor } from "~/apps/solidarity-routing/libs/color-handling";
import { OptimizedStop } from "~/apps/solidarity-routing/types.wip";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";
import { prisma } from "~/server/db";
import { api } from "~/utils/api";
import { authenticateUser } from "~/utils/auth";

interface IProps {
  data: RouteData;
  steps: StepData[];
}

const LazyRoutingMap = dynamic(
  () => import("~/apps/solidarity-routing/components/map/routing-map"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

const OptimizedPathPage: FC<IProps> = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const optimizedRoutePlan = useOptimizedRoutePlan();
  const driverRoute = useDriverVehicleBundles();

  const driver = driverRoute.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );

  return (
    <>
      <RouteLayout>
        {optimizedRoutePlan.isLoading ? (
          <PageLoader />
        ) : (
          <>
            {optimizedRoutePlan.data && (
              <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
                <div className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12">
                  <>
                    <Beforeunload
                      onBeforeunload={(event) => {
                        event.preventDefault();
                      }}
                    />

                    <RouteBreakdown
                      steps={optimizedRoutePlan.data.stops as OptimizedStop[]}
                      driver={driver}
                      color={
                        getColor(cuidToIndex(optimizedRoutePlan.data.vehicleId))
                          .background
                      }
                    />

                    <Button>Start route</Button>
                  </>
                </div>

                <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
              </section>
            )}
          </>
        )}
      </RouteLayout>
    </>
  );
};

const MobileDrawer = () => {
  const optimizedRoutePlan = useOptimizedRoutePlan();
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button variant="outline">Open Drawer</Button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            <DrawerTitle>
              {optimizedRoutePlan.routeDetails?.deliveryAt.toDateString()}
            </DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>
          <div className="p-4 pb-0">
            <div className="flex items-center justify-center space-x-2"></div>
            <div className="mt-3 h-[120px]">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="outline">Open Drawer</Button>
                </DrawerTrigger>
                <DrawerContent>
                  <div className="mx-auto w-full max-w-sm">
                    <DrawerHeader>
                      <DrawerTitle>
                        {optimizedRoutePlan.routeDetails?.deliveryAt.toDateString()}
                      </DrawerTitle>
                      <DrawerDescription>
                        Set your daily activity goal.
                      </DrawerDescription>
                    </DrawerHeader>
                    <div className="p-4 pb-0">
                      <div className="flex items-center justify-center space-x-2"></div>
                      <div className="mt-3 h-[120px]"></div>
                    </div>
                    <DrawerFooter>
                      <Button>Submit</Button>
                      <DrawerClose asChild>
                        <Button variant="outline">Cancel</Button>
                      </DrawerClose>
                    </DrawerFooter>
                  </div>
                </DrawerContent>
              </Drawer>
            </div>
          </div>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

// export const getServerSideProps = async (
//   context: GetServerSidePropsContext
// ) => {

//   const user = await authenticateUser(context);

//   if(!user) return {
//     props: {},
//   }

//   const data = await prisma.depot.findUnique({
//     where: {
//       ownerId: context.query.route as string,
//     },
//   });

//   if (!data)
//     return {
//       redirect: {
//         destination: `/tools/routing`,
//         permanent: false,
//       },
//     };

//   // const jsonObject = await parseIncomingDBData(data);

//   return {
//     props: {
//       data: data.route,
//       steps: (data.route ).steps,
//     },
//   };
// };

export default OptimizedPathPage;
