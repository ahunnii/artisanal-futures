import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import {
  ArrowRight,
  Building,
  Calendar,
  Loader2,
  Pencil,
  Send,
  PlusCircle,
} from "lucide-react";

import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent } from "~/components/ui/tabs";

import { DriversTab } from "~/apps/solidarity-routing/components/drivers-section";
import { StopsTab } from "~/apps/solidarity-routing/components/stops-section";

import CalculationsTab from "~/apps/solidarity-routing/components/route-plan-section/calculations-tab";

import RouteLayout from "~/apps/solidarity-routing/components/layout/route-layout";

import { MessageSheet } from "~/apps/solidarity-routing/components/messaging/message-sheet";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";

import { useUrlParams } from "~/hooks/use-url-params";

import { pusherClient } from "~/server/soketi/client";
import { api } from "~/utils/api";

import type { GetServerSidePropsContext } from "next";

import { PlanMobileDrawer } from "~/apps/solidarity-routing/components/mobile/plan-mobile-drawer";
import { ViewPathsMobileDrawer } from "~/apps/solidarity-routing/components/mobile/view-paths-mobile-drawer";
import { DriverVehicleSheet } from "~/apps/solidarity-routing/components/sheet-driver";
import { JobClientSheet } from "~/apps/solidarity-routing/components/sheet-job";
import { useMassMessage } from "~/apps/solidarity-routing/hooks/use-mass-message";
import { authenticateRoutingServerSide } from "~/apps/solidarity-routing/utils/authenticate-user";
import { notificationService } from "~/services/notification";


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

  const upsertAllClients = async () => {
    try {
      const response = await fetch('/api/importClients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ seedName: "deeplyrooted" }),
      });
      const data = await response.json();
      console.log(data.result);

      // Optionally, update your UI based on the response

    } catch (error) {
      console.error('Failed to add clients:', error);
    }
  };

  const [showAdvanced, setShowAdvanced] = useState(false);

  const { updateUrlParams, getUrlParam } = useUrlParams();

  const [parent] = useAutoAnimate();

  const [showRouteLayout, setShowRouteLayout] = useState(false);

  const driverBundles = useDriverVehicleBundles();

  const jobBundles = useClientJobBundles();
  const routePlans = useRoutePlans();

  const apiContext = api.useContext();

  useEffect(() => {
    pusherClient.subscribe("map");

    pusherClient.bind("evt::notify-dispatch", (message: string) => {
      notificationService.notifyInfo({ message });
    });

    pusherClient.bind("evt::invalidate-stops", (message: string) => {
      notificationService.notifyInfo({ message });
      void apiContext.routePlan.invalidate();
    });

    pusherClient.bind("evt::update-route-status", (message: string) => {
      notificationService.notifyInfo({ message });

      void apiContext.routePlan.invalidate();
    });

    return () => {
      pusherClient.unsubscribe("map");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const calculateOptimalPaths = () => {
    updateUrlParams({
      key: "mode",
      value: "calculate",
    });
    void routePlans.calculate();
  };

  const isRouteDataMissing =
    jobBundles.data.length === 0 || driverBundles.data.length === 0;

  const { massSendRouteEmails, isLoading } = useMassMessage();

  return (
    <>
    <RouteLayout>

        <div className="p-1">
          <Button onClick={() => setShowAdvanced(!showAdvanced)} className="bg-black text-white hover:bg-dark-gray">{showAdvanced ? "Close" : "Details"}</Button>
        </div>

        <div className="p-1">
          <Button onClick={() => upsertAllClients()} className="bg-black text-white hover:bg-dark-gray">
            <PlusCircle/> Clients  
          </Button>
        </div>

        {/* Tracking related widgets */}
        <DriverVehicleSheet />
        <JobClientSheet />
        <MessageSheet />

      {routePlans.isLoading && <AbsolutePageLoader />}

      {!routePlans.isLoading &&
        routePlans.data &&
        routePlans.optimized &&
        getUrlParam("mode") && (
          <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
            <Tabs
              value={getUrlParam("mode") ?? "plan"}
              onValueChange={(e) => {
                updateUrlParams({ key: "mode", value: e });
              }}
              ref={parent}
              className={`flex w-full max-w-sm flex-col gap-4 max-lg:hidden max-lg:h-4/6 ${!showAdvanced ? 'hidden' : ''}`}
            >
              <div className="flex items-center gap-1 px-4 pt-4 text-sm">
                <Link
                  href={`/tools/solidarity-pathways/${routePlans.data.depotId}/overview`}
                  className="flex gap-1"
                >
                  <Building className="h-4 w-4" /> Depot{" "}
                  <span className="max-w-28 truncate text-ellipsis ">
                    {routePlans.depot?.name ?? routePlans.depot?.id}
                  </span>{" "}
                  /{" "}
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
                  <div className=" flex h-16 items-center justify-end gap-2 bg-white p-4">
                    {routePlans.optimized.length === 0 && (
                      <Button
                        onClick={calculateOptimalPaths}
                        className="gap-2"
                        disabled={isRouteDataMissing}
                      >
                        Calculate Routes <ArrowRight />
                      </Button>
                    )}

                    {routePlans.optimized.length !== 0 && (
                      <>
                        <Button
                          variant={"outline"}
                          onClick={() =>
                            updateUrlParams({
                              key: "mode",
                              value: "calculate",
                            })
                          }
                          className="gap-2"
                        >
                          Cancel
                        </Button>
                        <Button
                          onClick={calculateOptimalPaths}
                          className="flex-1 gap-2"
                          disabled={isRouteDataMissing}
                        >
                          Recalculate Routes <ArrowRight />
                        </Button>
                      </>
                    )}
                  </div>
                </>
              </TabsContent>
              <TabsContent value="calculate" asChild>
                <>
                  <CalculationsTab />
                  <div className=" flex h-16 items-center justify-between gap-2 bg-white p-4">
                    <Button
                      // size="icon"
                      variant={"outline"}
                      className=" gap-2"
                      onClick={() =>
                        updateUrlParams({ key: "mode", value: "plan" })
                      }
                    >
                      <Pencil /> Edit Routes
                    </Button>
                    <Button
                      className="flex-1 gap-2"
                      onClick={massSendRouteEmails}
                    >
                      {isLoading ? (
                        <Loader2 className=" h-5 w-5 animate-spin" />
                      ) : (
                        <Send className=" h-5 w-5" />
                      )}
                      Send to Driver(s)
                    </Button>
                  </div>
                </>
              </TabsContent>
            </Tabs>
            <div className="flex gap-2 p-1 lg:hidden">
              <PlanMobileDrawer />
              <ViewPathsMobileDrawer />
            </div>
            <LazyRoutingMap className="w-full max-md:aspect-square" />
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

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateRoutingServerSide(ctx);

export default SingleRoutePage;

