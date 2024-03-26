import { uniqueId } from "lodash";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useState } from "react";

import { jobTypeSchema } from "~/apps/solidarity-routing/types.wip";

import {
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

import { useAutoAnimate } from "@formkit/auto-animate/react";

import {
  ArrowRight,
  Building,
  Calendar,
  Loader2,
  Pencil,
  PencilIcon,
  PlusCircle,
  Rocket,
  Send,
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

// Route among lasso selections
import { useStopsStore } from "~/apps/solidarity-routing/hooks/jobs/use-stops-store";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";

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
  const fetchCsvDataFromApi = async () => {
    try {
      const response = await fetch("/api/importClients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ seedName: routePlans.depot?.magicCode }),
      });
      const data = await response.json();

      // Got json from api endpoint
      //console.log(data.result);

      return data.result;
    } catch (error) {
      console.error("Error upserting clients:", error);
    }
  };

  const apiContext = api.useContext();

  const clearOptimizedStops =
    api.routePlan.clearOptimizedStopsFromRoute.useMutation({
      onSuccess: () => {
        notificationService.notifySuccess({
          message: "Optimized stops have been cleared",
        });
      },
      onError: (error) => {
        notificationService.notifyError({
          message: error?.message ?? "An error occurred",
          error,
        });
      },

      onSettled: () => {
        void apiContext.routePlan.invalidate();
      },
    });

  const [showAdvanced, setShowAdvanced] = useState(false);

  const { updateUrlParams, getUrlParam } = useUrlParams();

  const [parent] = useAutoAnimate();

  const [showRouteLayout, setShowRouteLayout] = useState(false);

  const driverBundles = useDriverVehicleBundles();

  const jobBundles = useClientJobBundles();
  const routePlans = useRoutePlans();

  const { routeId } = useSolidarityState();

  useEffect(() => {
    pusherClient.subscribe("map");

    pusherClient.bind("evt::notify-dispatch", (message: string) => {
      notificationService.notifyInfo({ message });
    });

    pusherClient.bind("evt::invalidate-stops", (message: string | null) => {
      if (message !== null && message !== "")
        notificationService.notifyInfo({ message });
      void apiContext.routePlan.invalidate();
    });

    pusherClient.bind("evt::invalidate-route", (message: string | null) => {
      if (message !== null && message !== "")
        notificationService.notifyInfo({ message });
      void apiContext.routePlan.invalidate();
    });

    pusherClient.bind("evt::update-route-status", (message: unknown) => {
      notificationService.notifyInfo({
        message: JSON.stringify(message) ?? "Route has been updated",
      });

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
    void routePlans.calculate(selectedJobIds);
  };

  const [loadingImportClient, setLoadingImportClient] = useState(false);
  const isRouteDataMissing =
    jobBundles.data.length === 0 || driverBundles.data.length === 0;

  const { massSendRouteEmails, isLoading } = useMassMessage();

  const makeOneClientJob = (data) => {
    const clientId = data?.clientId ?? uniqueId("client_");
    const addressId = data?.clientAddressId ?? uniqueId("address_");
    const jobId = uniqueId("job_");

    return {
      client: {
        id: clientId,
        email: data.email ?? "",
        phone: data.phone ?? undefined,
        name: data.name ?? "",
        addressId: addressId,
        address: {
          formatted: data?.clientAddress?.formatted ?? data?.address,
          latitude: data?.clientAddress?.latitude ?? data?.lat,
          longitude: data?.clientAddress?.longitude ?? data?.lon,
        },
      },
      job: {
        id: jobId,
        addressId: addressId,
        clientId: clientId,

        address: {
          formatted: data?.clientAddress?.formatted ?? data?.address,
          latitude: data?.clientAddress?.latitude ?? data?.lat,
          longitude: data?.clientAddress?.longitude ?? data?.lon,
        },

        type: jobTypeSchema.parse("DELIVERY"),
        prepTime: minutesToSeconds(data?.prep_time ?? 0),
        priority: Number(data?.priority ?? 0),
        serviceTime: minutesToSeconds(data?.serviceTime ?? 0),
        timeWindowStart: militaryTimeToUnixSeconds(data.time_start),
        timeWindowEnd: militaryTimeToUnixSeconds(data.time_end),
        order: data?.order ?? "",
        notes: data?.notes ?? "",
      },
    };
  };

  const jobs = useClientJobBundles();

  const { setSelectedJobIds, selectedJobIds } = useStopsStore((state) => ({
    setSelectedJobIds: state.setSelectedJobIds,
    selectedJobIds: state.selectedJobIds,
  }));

  const buildManyJobs = async () => {
    setLoadingImportClient(true);
    const data = await fetchCsvDataFromApi();

    data?.forEach((jobData) => {
      const one_job = makeOneClientJob(jobData);
      jobs.create({
        job: one_job,
        addToRoute: true,
      });

      console.log(
        "**** buildManyJobs ...",
        one_job.client.name,
        one_job.job.id
      );
    });
  };

  // IF driver we need to track
  //
  // useEffect(() => {
  //   let lastPosition = { lat: null, lng: null };
  //   const checkDriverMovement = () => {

  //     console.log("in these parts, checking location")
  //     if (currentLocation && lastPosition.lat && lastPosition.lng) {
  //       const distance = Math.sqrt(
  //         Math.pow(currentLocation.lat - lastPosition.lat, 2) +
  //         Math.pow(currentLocation.lng - lastPosition.lng, 2)
  //       );
  //       if (distance > 0.002) { // approximately 2 meters difference
  //         flyToCurrentLocation();
  //       }
  //     }
  //     lastPosition = { ...currentLocation };
  //   };

  //   const movementInterval = setInterval(checkDriverMovement, 1000); // check every second

  //   return () => clearInterval(movementInterval);
  // }, [currentLocation, flyToCurrentLocation]);

  const editRouteCallback = () => {
    const routeId = window.location.pathname.split("/route/")[1];

    clearOptimizedStops.mutate({
      routeId,
    });

    // routePlans.clearRoute.mutate({ routeId: routeId || "" });
    //void apiContext.routePlan.invalidate();
    setSelectedJobIds([]); // reset them

    console.log("need to start clearing things here");

    updateUrlParams({
      key: "mode",
      value: "plan",
    });
  };

  return (
    <>
      <RouteLayout>
        <div className="flex flex-col">
          <div className="p-1">
            <Button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="hover:bg-dark-gray bg-black text-white"
            >
              <PencilIcon /> {showAdvanced ? "Close" : "Details"}
            </Button>
          </div>

          <div className="p-1">
            <Button
              onClick={() =>
                void buildManyJobs().finally(() =>
                  setLoadingImportClient(false)
                )
              }
              disabled={loadingImportClient}
              className="hover:bg-dark-gray bg-black text-white"
            >
              {loadingImportClient ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <PlusCircle />
              )}
              Clients
            </Button>
          </div>

          <div className="p-1">
            <Button
              onClick={() => calculateOptimalPaths()}
              className="hover:bg-dark-gray bg-black text-white"
            >
              <Rocket /> Route
            </Button>
          </div>

          {/* {routePlans.optimized && routePlans.optimized.length > 0 && (
            <div className="p-1">
              <Button
                onClick={() =>
                  clearOptimizedStops.mutate({
                    routeId,
                  })
                }
                className="hover:bg-dark-gray bg-black text-white"
              >
                <Bomb /> Clear Optimized
              </Button>
            </div>
          )} */}
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
                className={`flex w-full max-w-sm flex-col gap-4 max-lg:hidden max-lg:h-4/6 ${
                  !showAdvanced ? "hidden" : ""
                }`}
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
                            onClick={() => editRouteCallback()}
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
                        // onClick={() =>
                        //   updateUrlParams({ key: "mode", value: "plan" })
                        // }
                        onClick={editRouteCallback}
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
              <LazyRoutingMap
                showAdvanced={showAdvanced}
                className="w-full max-md:aspect-square"
              />
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
