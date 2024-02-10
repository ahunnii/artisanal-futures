import dynamic from "next/dynamic";

import { useEffect, useState } from "react";

import { ArrowRight, Building, Calendar, Pencil } from "lucide-react";

import { DriversTab } from "~/apps/solidarity-routing/components/drivers";
import {
  StopSheet,
  StopsTab,
} from "~/apps/solidarity-routing/components/stops";

import CalculationsTab from "~/apps/solidarity-routing/components/solutions/calculations-tab";
import BottomSheet from "~/apps/solidarity-routing/components/ui/bottom-sheet";
import { useDriversStore } from "~/apps/solidarity-routing/hooks/drivers/use-drivers-store";

import { useStopsStore } from "~/apps/solidarity-routing/hooks/use-stops-store";
import RouteLayout from "~/apps/solidarity-routing/route-layout";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent } from "~/components/ui/tabs";

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
  const driverBundles = useDriverVehicleBundles();
  const jobBundles = useClientJobBundles();
  const routePlans = useRoutePlans();

  useEffect(() => {
    void useStopsStore.persist.rehydrate();
    void useDriversStore.persist.rehydrate();
  }, []);

  const calculateOptimalPaths = () => {
    setTabValue("calculate");
    void routePlans.calculate();
  };

  const openTrackingPage = () =>
    window.open("/tools/routing/tracking", "_blank");

  const isRouteDataMissing =
    jobBundles.data.length === 0 || driverBundles.data.length === 0;

  const [tabValue, setTabValue] = useState<string>("plan");

  const [parent] = useAutoAnimate();

  useEffect(() => {
    if (routePlans.optimized.length > 0) {
      setTabValue("calculate");
    }
  }, [routePlans.optimized]);

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
                    <Button className="flex-1 gap-2">
                      Send to Driver(s) <ArrowRight />
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
                isDisabled={
                  jobBundles.data.length === 0 ||
                  driverBundles.data.length === 0
                }
                // handleOnClick={calculateOptimalPaths}
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
