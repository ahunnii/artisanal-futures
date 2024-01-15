import dynamic from "next/dynamic";
import Head from "next/head";

import InteractiveRouteCard from "~/apps/solidarity-routing/components/solutions/interactive-route-card";
import LoadingIndicator from "~/apps/solidarity-routing/components/solutions/loading-indicator";

import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";
import { Badge } from "~/components/ui/badge";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ScrollArea } from "~/components/ui/scroll-area";

import BottomSheet from "~/apps/solidarity-routing/components/ui/bottom-sheet";

import useRealTime from "~/apps/solidarity-routing/hooks/use-realtime";
import RouteLayout from "~/layouts/route-layout";
import { api } from "~/utils/api";

import { useEffect } from "react";
import { pusherClient } from "~/server/soketi/client";
import { cn } from "~/utils/styles";

const LazyTrackingMap = dynamic(
  () => import("~/apps/solidarity-routing/components/map/tracking-map"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

const TrackingPage = () => {
  const { activeUsers, messages } = useRealTime();

  console.log(messages);
  const apiContext = api.useContext();

  const { data: routes } =
    api.finalizedRoutes.getAllFormattedFinalizedRoutes.useQuery({
      filterOut: "COMPLETED",
    });

  const testMessage = (message: string) => {
    if (message === "invalidate") {
      // toast.success("Invalidate");

      // void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();

      // void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();
      // void apiContext.finalizedRoutes.getFinalizedRoute.invalidate();

      void apiContext.finalizedRoutes.invalidate();
    }
  };

  useEffect(() => {
    const channel = pusherClient.subscribe("map");
    channel.bind("evt::test-message", testMessage);

    return () => {
      channel.unbind();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const checkIfOnline = (idx: number) => {
    if (activeUsers.length > 0) {
      const user = activeUsers.find((user) => user.route.vehicle === idx);
      if (user) return true;
    }
    return false;
  };

  return (
    <>
      <Head>
        <title>Dispatch Tracking | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />{" "}
        <meta
          name="viewport"
          content="width=device-width,height=device-height initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />{" "}
      </Head>
      <RouteLayout>
        <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
          <section className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12">
            <div className="p-4 ">
              <h2 className="text-3xl font-bold tracking-tight">
                Dispatch Tracking
              </h2>
              <p>Track your current drivers and manage your routes</p>
            </div>
            <ScrollArea className={cn(" h-3/5 w-full  rounded-md border p-4 ")}>
              {" "}
              {(!routes || routes.length == 0) && (
                <div className="">
                  {" "}
                  <div className=" flex p-5 ">
                    <LoadingIndicator />{" "}
                    <p className="font-semibold"> Fetching routes...</p>
                  </div>
                </div>
              )}
              {routes &&
                routes.length > 0 &&
                routes.map((route: ExpandedRouteData, idx: number) => {
                  return (
                    <InteractiveRouteCard
                      key={idx}
                      data={route}
                      className="w-full"
                      isOnline={checkIfOnline(route.vehicle)}
                      isTracking={true}
                      textColor={route?.vehicle}
                    />
                  );
                })}{" "}
            </ScrollArea>
            <ScrollArea className="h-2/5 w-full flex-1 rounded-md border p-4">
              <h3 className="text-lg font-medium">
                Incoming Messages from Drivers
              </h3>

              {messages.length == 0 && (
                <div className="">
                  {" "}
                  <div className=" flex py-5 ">
                    <p className="font-normal">
                      No messages have been sent this session
                    </p>
                  </div>
                </div>
              )}

              {messages &&
                messages.length > 0 &&
                messages.map((message, idx) => {
                  return (
                    <Card key={idx}>
                      <CardHeader className="pb-3">
                        <CardTitle className="flex items-center justify-between gap-4">
                          {message.name}

                          <Badge>{message.status}</Badge>
                        </CardTitle>
                        <CardDescription>{message.address}</CardDescription>
                      </CardHeader>
                      <CardContent className="grid gap-1">
                        <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                          <div className="space-y-1">
                            <p className="text-sm font-medium leading-none">
                              Message
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {message.deliveryNotes} {message?.routeId}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
            </ScrollArea>
          </section>
          <div className="flex lg:hidden">
            <BottomSheet title="Dispatch Tracking">
              <ScrollArea
                className={cn(" h-3/5 w-full  rounded-md border p-4 ")}
              >
                {" "}
                {(!routes || routes.length == 0) && (
                  <div className="">
                    {" "}
                    <div className=" flex p-5 ">
                      <LoadingIndicator />{" "}
                      <p className="font-semibold"> Fetching routes...</p>
                    </div>
                  </div>
                )}
                {routes &&
                  routes.length > 0 &&
                  routes.map((route: ExpandedRouteData, idx: number) => {
                    return (
                      <InteractiveRouteCard
                        key={idx}
                        data={route}
                        className="w-full"
                        isOnline={checkIfOnline(route.vehicle)}
                        isTracking={true}
                        textColor={route?.vehicle}
                      />
                    );
                  })}{" "}
              </ScrollArea>
            </BottomSheet>

            <BottomSheet title="Messages">
              <ScrollArea className="h-2/5 w-full flex-1 rounded-md border p-4">
                <h3 className="text-lg font-medium">
                  Incoming Messages from Drivers
                </h3>

                {messages.length == 0 && (
                  <div className="">
                    {" "}
                    <div className=" flex py-5 ">
                      <p className="font-normal">
                        No messages have been sent this session
                      </p>
                    </div>
                  </div>
                )}

                {messages &&
                  messages.length > 0 &&
                  messages.map((message, idx) => {
                    return (
                      <Card key={idx}>
                        <CardHeader className="pb-3">
                          <CardTitle className="flex items-center justify-between gap-4">
                            {message.name}

                            <Badge>{message.status}</Badge>
                          </CardTitle>
                          <CardDescription>{message.address}</CardDescription>
                        </CardHeader>
                        <CardContent className="grid gap-1">
                          <div className="-mx-2 flex items-start space-x-4 rounded-md p-2 transition-all hover:bg-accent hover:text-accent-foreground">
                            <div className="space-y-1">
                              <p className="text-sm font-medium leading-none">
                                Message
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {message.deliveryNotes} {message?.routeId}
                              </p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
              </ScrollArea>
            </BottomSheet>
          </div>
          <LazyTrackingMap
            activeUsers={activeUsers}
            className="max-md:aspect-square lg:w-7/12 xl:w-9/12"
          />
        </section>
      </RouteLayout>
    </>
  );
};

export default TrackingPage;
