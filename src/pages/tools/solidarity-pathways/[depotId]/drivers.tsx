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
import RouteHeaderCard from "~/apps/solidarity-routing/components/ui/cards/optimized-route-header-card";
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

const DriverPage: FC<IProps> = () => {
  const params = useParams();
  const searchParams = useSearchParams();

  const { data: route, isLoading } = api.routePlan.getRoutePlanById.useQuery(
    {
      id: searchParams.get("routeId") ?? "",
    },
    {
      refetchIntervalInBackground: true,
      enabled: searchParams.has("routeId"),
    }
  );

  // const { stops, setStops, selectedStop } = useDriverRoute((state) => state);
  // const { isTrackingCurrentUser, setIsTrackingCurrentUser } = useRealTime(
  //   data?.route,
  //   (params?.route as string) ?? ""
  // );

  // const [open, setOpen] = useState(false);
  // const [dataOpen, setDataOpen] = useState<boolean>(false);

  // // useEffect(() => {
  // //   if (steps) setStops(steps);
  // // }, [steps]);

  // useEffect(() => {
  //   if (data) setStops(data?.steps);
  // }, [data]);

  // // If user clicks on a stop, open the stop details modal
  // useEffect(() => {
  //   if (selectedStop) setOpen(true);
  // }, [selectedStop]);

  return (
    <>
      <RouteLayout>
        {isLoading ? (
          <PageLoader />
        ) : (
          <>
            {route && (
              <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
                <div className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12">
                  <>
                    <Beforeunload
                      onBeforeunload={(event) => {
                        event.preventDefault();
                      }}
                    />
                    {/* {data?.steps && data?.steps?.length > 0 && (
                      <DriverRouteBreakdown
                        data={data?.route}
                        steps={stops}
                        textColor={data?.route?.vehicle}
                      />
                    )} */}
                    {/* <Button
                      onClick={() => setIsTrackingCurrentUser(true)}
                      disabled={isTrackingCurrentUser}
                      variant={isTrackingCurrentUser ? "secondary" : "default"}
                    >
                      {isTrackingCurrentUser && <LoadingIndicator />}
                      {isTrackingCurrentUser
                        ? "Broadcasting location with dispatch..."
                        : "Start Route"}
                    </Button>{" "} */}
                    <Button>Start route</Button>
                    {/* {isTrackingCurrentUser && (
                      <Button
                        onClick={() => setIsTrackingCurrentUser(false)}
                        variant={"default"}
                      >
                        Stop broadcasting location with dispatch
                      </Button>
                    )} */}
                    {/* {selectedStop && (
                      <StopDetails
                        open={open}
                        setOpen={setOpen}
                        routeData={data?.route}
                      />
                    )} */}
                  </>
                </div>

                {/* <div className="flex lg:hidden">
                  <Sheet open={dataOpen} onOpenChange={setDataOpen}>
                    <SheetTrigger>
                      <RouteHeaderCard
                        data={data?.route}
                        textColor={data?.route?.vehicle}
                      />
                    </SheetTrigger>

                    <SheetContent
                      side={"bottom"}
                      className=" flex h-[75vh]    flex-col rounded-t-3xl p-2"
                    >
                      <SheetHeader className=" pt-4 ">
                        <SheetTitle></SheetTitle>
                      </SheetHeader>
                      <ScrollArea className="h-[calc(100%-64px)] w-full gap-5 p-4">
                        <>
                          <Beforeunload
                            onBeforeunload={(event) => {
                              event.preventDefault();
                            }}
                          />
                          {data?.steps.length > 0 && (
                            <DriverRouteBreakdown
                              data={data?.route}
                              steps={stops}
                              textColor={data?.route?.vehicle}
                            />
                          )}
                        </>
                      </ScrollArea>{" "}
                      <Button
                        onClick={() => setIsTrackingCurrentUser(true)}
                        className="w-full"
                        disabled={isTrackingCurrentUser}
                        variant={
                          isTrackingCurrentUser ? "secondary" : "default"
                        }
                      >
                        {isTrackingCurrentUser && <LoadingIndicator />}
                        {isTrackingCurrentUser
                          ? "Broadcasting location with dispatch..."
                          : "Start Route"}
                      </Button>{" "}
                      {isTrackingCurrentUser && (
                        <Button
                          onClick={() => setIsTrackingCurrentUser(false)}
                          variant={"default"}
                          className="w-full"
                        >
                          Stop broadcasting location with dispatch
                        </Button>
                      )}
                      {selectedStop && (
                        <StopDetails
                          open={open}
                          setOpen={setOpen}
                          routeData={data?.route}
                        />
                      )}
                    </SheetContent>
                  </Sheet>
                </div> */}
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button variant="outline">Open Drawer</Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>
                          {route.deliveryAt.toDateString()}
                        </DrawerTitle>
                        <DrawerDescription>
                          Set your daily activity goal.
                        </DrawerDescription>
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
                                    {route.deliveryAt.toDateString()}
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
                <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
              </section>
            )}
          </>
        )}
      </RouteLayout>
    </>
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

export default DriverPage;
