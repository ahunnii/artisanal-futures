import axios from "axios";

import dynamic from "next/dynamic";
import Head from "next/head";

import Pusher from "pusher-js";
import { useCallback, useEffect, useState } from "react";

import { SimplifiedRouteCard } from "~/components/tools/routing/solutions/route-card";
import StopDetails from "~/components/tools/routing/tracking/stop-details";
import type {
  PusherUserData,
  RouteData,
  StepData,
} from "~/components/tools/routing/types";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { env } from "~/env.mjs";
import ToolLayout from "~/layouts/tool-layout";
import { cn } from "~/utils/styles";
const LazyTrackingMap = dynamic(
  () => import("~/components/tools/routing/map/TrackingMap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

const TrackingPage = () => {
  const [activeUsers, setActiveUsers] = useState<PusherUserData[]>([]);
  const [currentRoutes, setCurrentRoutes] = useState<RouteData[]>([]);
  const [selected, setSelected] = useState<StepData | null>(null);

  const [open, setOpen] = useState(false);
  useEffect(() => {
    const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
      cluster: "us2",
    });
    const channel = pusher.subscribe("map");

    channel.bind("update-locations", setActiveUsers);

    axios
      .get("/api/fetch-routes")
      .then(function (response) {
        setCurrentRoutes(response.data.data as RouteData[]);
      })
      .catch(function (error) {
        console.log(error);
      });

    return () => {
      pusher.unsubscribe("map");
    };
  }, []);

  const handleOnStopClick = useCallback((data: StepData | null) => {
    setSelected(data);
    setOpen(true);
  }, []);
  useEffect(() => {
    console.log(activeUsers);
  }, [activeUsers]);

  const checkIfOnline = (idx: number) => {
    if (activeUsers.length > 0) {
      const user = activeUsers.find((user) => user.route.vehicle === idx);
      if (user) {
        return true;
      }
    }
    return false;
  };
  return (
    <>
      <Head>
        <title>Dispatch View | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />{" "}
      </Head>
      <ToolLayout>
        <section className="flex w-full flex-grow flex-col  justify-between pb-4 lg:w-5/12 xl:w-4/12 2xl:w-3/12">
          <div className="flex h-full flex-col">
            <h1 className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
              All Routes
            </h1>{" "}
            <ScrollArea className="h-4/5 w-full rounded-md border p-4">
              {" "}
              {currentRoutes &&
                currentRoutes.length > 0 &&
                currentRoutes.map((route, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "border ",
                      checkIfOnline(route.vehicle) ? "border-green-500" : ""
                    )}
                  >
                    <SimplifiedRouteCard
                      data={route}
                      className="w-full"
                      handleOnStopClick={handleOnStopClick}
                    />
                  </div>
                ))}{" "}
            </ScrollArea>
          </div>

          <Button>Adjust Routes</Button>

          {selected && (
            <StopDetails stop={selected} open={open} setOpen={setOpen} />
          )}
        </section>
        <section className="relative z-0  flex aspect-square w-full flex-grow overflow-hidden  pl-8 lg:aspect-auto lg:w-7/12 xl:w-9/12 2xl:w-9/12">
          <LazyTrackingMap activeUsers={activeUsers} />
        </section>
      </ToolLayout>
    </>
  );
};

export default TrackingPage;
