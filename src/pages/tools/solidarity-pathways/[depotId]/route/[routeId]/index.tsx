import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import axios from "axios";
import { ArrowRight, Building, Calendar, Pencil } from "lucide-react";
import { toast as hotToast } from "react-hot-toast";
import { toast } from "sonner";

import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent } from "~/components/ui/tabs";

import { DriversTab } from "~/apps/solidarity-routing/components/drivers";
import {
  StopSheet,
  StopsTab,
} from "~/apps/solidarity-routing/components/stops";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTrigger,
} from "~/components/ui/drawer";

import CalculationsTab from "~/apps/solidarity-routing/components/solutions/calculations-tab";

import { useDriversStore } from "~/apps/solidarity-routing/hooks/drivers/use-drivers-store";

import { useStopsStore } from "~/apps/solidarity-routing/hooks/jobs/use-stops-store";
import RouteLayout from "~/apps/solidarity-routing/route-layout";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import { ScrollArea } from "~/components/ui/scroll-area";
import { pusherClient } from "~/server/soketi/client";
import { api } from "~/utils/api";

const LazyRoutingMap = dynamic(
  () => import("~/apps/solidarity-routing/components/map/routing-map"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);
/**
 * Page component that allows users to generate routes based on their input.
 */
const SingleRoutePage = () => {
  const [tabValue, setTabValue] = useState<string>("plan");
  const [parent] = useAutoAnimate();

  const driverBundles = useDriverVehicleBundles();

  const jobBundles = useClientJobBundles();
  const routePlans = useRoutePlans();

  const apiContext = api.useContext();

  useEffect(() => {
    void useStopsStore.persist.rehydrate();
    void useDriversStore.persist.rehydrate();
  }, []);

  useEffect(() => {
    pusherClient.subscribe("map");

    pusherClient.bind("evt::notify-dispatch", (message: string) => {
      toast.info(message);
    });

    pusherClient.bind("evt::invalidate-stops", () => {
      void apiContext.finalizedRoutes.invalidate();
      void apiContext.routePlan.invalidate();
    });

    pusherClient.bind("evt::update-route-status", (message: string) => {
      toast.info(message);
      void apiContext.finalizedRoutes.invalidate();
      void apiContext.routePlan.invalidate();
    });

    return () => {
      pusherClient.unsubscribe("map");
    };
  }, []);

  useEffect(() => {
    if (routePlans.optimized.length > 0) {
      setTabValue("calculate");
    }
  }, [routePlans.optimized]);

  const calculateOptimalPaths = () => {
    setTabValue("calculate");
    void routePlans.calculate();
  };

  const isRouteDataMissing =
    jobBundles.data.length === 0 || driverBundles.data.length === 0;

  const massSendRouteEmails = () => {
    axios
      .post("/api/routing/send-route", {
        emailBundles: routePlans?.emailBundles,
      })
      .then((res) => {
        if (res.status === 200) {
          hotToast.success("Route sent to drivers successfully");
        } else {
          hotToast.error("Error sending route to drivers");
        }
      })
      .catch((err) => {
        console.log(err);
        hotToast.error("Error sending route to drivers");
      });
  };

  return (
    <>
      <RouteLayout>
        {routePlans.isLoading && <AbsolutePageLoader />}

        {!routePlans.isLoading && routePlans.data && (
          <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
            <Tabs
              defaultValue={"plan"}
              value={tabValue}
              onValueChange={setTabValue}
              ref={parent}
              className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12"
            >
              <div className="flex items-center gap-1 px-4 pt-4 text-sm">
                <Link
                  href={`/tools/solidarity-pathways/${routePlans.data.depotId}/overview`}
                  className="flex gap-1"
                >
                  <Building className="h-4 w-4" /> Depot{" "}
                  {routePlans.data.depotId} /{" "}
                </Link>
                <Link
                  href={`/tools/solidarity-pathways/${
                    routePlans.data.depotId
                  }/overview?date=${routePlans.data.deliveryAt
                    .toDateString()
                    .split(" ")
                    .join("+")}`}
                  className="flex gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  {routePlans.data?.deliveryAt.toDateString()}{" "}
                </Link>
              </div>

              <TabsContent value="plan" asChild>
                <>
                  <DriversTab />
                  <StopsTab />
                  <div className=" flex h-16 items-center justify-end bg-white p-4">
                    {routePlans.optimized.length === 0 && (
                      <Button
                        onClick={calculateOptimalPaths}
                        className="gap-2"
                        disabled={isRouteDataMissing}
                      >
                        Calculate Routes <ArrowRight />
                      </Button>
                    )}
                  </div>
                </>
              </TabsContent>
              <TabsContent value="calculate" asChild>
                <>
                  <StopSheet standalone={true} />
                  <CalculationsTab />
                  <div className=" flex h-16 items-center justify-between gap-2 bg-white p-4">
                    <Button
                      size="icon"
                      variant={"outline"}
                      onClick={() => setTabValue("plan")}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={massSendRouteEmails}
                    >
                      Send to Driver(s) <ArrowRight />
                    </Button>
                  </div>
                </>
              </TabsContent>
            </Tabs>
            <div className="flex gap-2 p-1 lg:hidden">
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="secondary" className="">
                    <Pencil /> Edit
                  </Button>
                </DrawerTrigger>
                <DrawerContent className=" max-h-screen ">
                  <DrawerHeader />
                  <ScrollArea className="mx-auto flex w-full  max-w-sm flex-col">
                    <DriversTab />
                    <StopsTab />
                    <div className=" flex h-16 items-center justify-end bg-white p-4"></div>
                  </ScrollArea>
                  <DrawerFooter>
                    {routePlans.optimized.length === 0 && (
                      <Button
                        onClick={calculateOptimalPaths}
                        className="gap-2"
                        disabled={isRouteDataMissing}
                      >
                        Calculate Routes <ArrowRight />
                      </Button>
                    )}
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
              <Drawer>
                <DrawerTrigger asChild>
                  <Button variant="default" className="w-full ">
                    Routes
                  </Button>
                </DrawerTrigger>
                <DrawerContent className=" max-h-screen ">
                  <DrawerHeader />
                  <ScrollArea className="mx-auto flex w-full  max-w-sm flex-col">
                    <StopSheet standalone={true} />
                    <CalculationsTab />
                    <div className=" flex h-16 items-center justify-between gap-2 bg-white p-4">
                      <Button
                        size="icon"
                        variant={"outline"}
                        onClick={() => setTabValue("plan")}
                      >
                        <Pencil />
                      </Button>
                      <Button
                        className="flex-1 gap-2"
                        onClick={massSendRouteEmails}
                      >
                        Send to Driver(s) <ArrowRight />
                      </Button>
                    </div>
                  </ScrollArea>
                  <DrawerFooter>
                    {routePlans.optimized.length === 0 && (
                      <Button
                        onClick={calculateOptimalPaths}
                        className="gap-2"
                        disabled={isRouteDataMissing}
                      >
                        Calculate Routes <ArrowRight />
                      </Button>
                    )}
                    <DrawerClose>
                      <Button variant="outline">Cancel</Button>
                    </DrawerClose>
                  </DrawerFooter>
                </DrawerContent>
              </Drawer>
            </div>
            <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
          </section>
        )}

        {!routePlans.isLoading && !routePlans.data && (
          <p className="mx-auto my-auto text-center text-2xl font-semibold text-muted-foreground">
            There seems to an issue when trying to fetch your routing plan.
            Please refresh the page and try again.
          </p>
        )}
      </RouteLayout>
    </>
  );
};

export default SingleRoutePage;
