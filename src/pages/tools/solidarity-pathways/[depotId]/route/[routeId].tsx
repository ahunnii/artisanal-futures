import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";

import { ArrowRight, Building, Calendar } from "lucide-react";

import { DriversTab } from "~/apps/solidarity-routing/components/drivers";
import {
  StopSheet,
  StopsTab,
} from "~/apps/solidarity-routing/components/stops";

import CalculationsTab from "~/apps/solidarity-routing/components/solutions/calculations-tab";
import BottomSheet from "~/apps/solidarity-routing/components/ui/bottom-sheet";
import { useDriversStore } from "~/apps/solidarity-routing/hooks/drivers/use-drivers-store";
import useRouteOptimization from "~/apps/solidarity-routing/hooks/use-route-optimization";
import { useStopsStore } from "~/apps/solidarity-routing/hooks/use-stops-store";
import RouteLayout from "~/apps/solidarity-routing/route-layout";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
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
  const params = useParams();
  const [tabValue, setTabValue] = useState<string>("plan");

  const { data: routePlan, isLoading } =
    api.routePlan.getRoutePlanById.useQuery(
      {
        id: params?.routeId as string,
      },
      {
        enabled: !!params?.routeId,
      }
    );

  const drivers = useDriverVehicleBundles();

  const jobs = useClientJobBundles();

  useEffect(() => {
    void useStopsStore.persist.rehydrate();
    void useDriversStore.persist.rehydrate();
  }, []);

  const { getRoutes } = useRouteOptimization();

  const calculateOptimalPaths = () => {
    setTabValue("calculate");
    void getRoutes();
  };

  const openTrackingPage = () =>
    window.open("/tools/routing/tracking", "_blank");

  const isRouteDataMissing =
    jobs.data.length === 0 || drivers.data.length === 0;

  return (
    <>
      <RouteLayout>
        {isLoading && <AbsolutePageLoader />}

        {!isLoading && routePlan && (
          <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
            <Tabs
              defaultValue="plan"
              value={tabValue}
              onValueChange={setTabValue}
              className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12"
            >
              <div className="flex items-center gap-1 px-4 pt-4 text-sm">
                <Link
                  href={`/tools/solidarity-pathways/${routePlan.depotId}/overview`}
                  className="flex gap-1"
                >
                  <Building className="h-4 w-4" /> Depot {routePlan.depotId} /{" "}
                </Link>
                <Link
                  href={`/tools/solidarity-pathways/${
                    routePlan.depotId
                  }/overview?date=${routePlan.deliveryAt
                    .toDateString()
                    .split(" ")
                    .join("+")}`}
                  className="flex gap-1"
                >
                  <Calendar className="h-4 w-4" />
                  {routePlan?.deliveryAt.toDateString()}{" "}
                </Link>

                <Button
                  className="ml-auto"
                  size={"sm"}
                  onClick={() => {
                    console.log(routePlan);
                  }}
                >
                  Log DB Route Status
                </Button>
              </div>

              {/* Route {routePlan?.id ?? 0} *{" "} */}
              <TabsList className=" flex ">
                <TabsTrigger value="plan" className="w-full">
                  Plan
                </TabsTrigger>
                <TabsTrigger
                  value="calculate"
                  className="w-full"
                  disabled={isRouteDataMissing}
                  onClick={calculateOptimalPaths}
                >
                  Calculate
                </TabsTrigger>{" "}
                <Button
                  className="w-full"
                  variant={"ghost"}
                  disabled={isRouteDataMissing}
                  onClick={openTrackingPage}
                >
                  Track
                </Button>
              </TabsList>
              <TabsContent value="plan" asChild>
                <>
                  <DriversTab />
                  <StopsTab />
                  <div className=" flex h-16 items-center justify-end bg-white p-4">
                    <Button
                      onClick={calculateOptimalPaths}
                      className="gap-2"
                      disabled={isRouteDataMissing}
                    >
                      Calculate Routes <ArrowRight />
                    </Button>
                  </div>
                </>
              </TabsContent>
              <TabsContent value="calculate" asChild>
                <>
                  <CalculationsTab />
                  <div className=" flex h-16 items-center justify-end bg-white p-4">
                    <Button
                      onClick={calculateOptimalPaths}
                      className="gap-2"
                      disabled={
                        jobs.data.length === 0 || drivers.data.length === 0
                      }
                    >
                      Calculate Routes <ArrowRight />
                    </Button>
                  </div>
                </>
              </TabsContent>
            </Tabs>
            <div className="flex lg:hidden">
              <BottomSheet title="Plan">
                <DriversTab />
                <StopsTab />
              </BottomSheet>

              <BottomSheet
                title="Calculate"
                isDisabled={jobs.data.length === 0 || drivers.data.length === 0}
                handleOnClick={calculateOptimalPaths}
              >
                <CalculationsTab />
              </BottomSheet>

              <Button
                className="w-full"
                variant={"ghost"}
                disabled={isRouteDataMissing}
                onClick={openTrackingPage}
              >
                Track
              </Button>
            </div>
            <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
          </section>
        )}

        {!isLoading && !routePlan && (
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
