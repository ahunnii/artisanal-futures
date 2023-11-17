import { BellIcon, ReloadIcon } from "@radix-ui/react-icons";

import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

import { useDrivers } from "~/hooks/routing/use-drivers";
import useRouteOptimization from "~/hooks/routing/use-route-optimization";
import { useRoutingSolutions } from "~/hooks/routing/use-routing-solutions";
import { useStops } from "~/hooks/routing/use-stops";

import type { RouteData } from "../types";

import { ScrollArea } from "~/components/ui/scroll-area";
import DriverSheet from "../drivers/driver-sheet";
import FulfillmentSheet from "../stops/fulfillment-sheet";
import { MinimalRouteCard } from "./minimal-route-card";
import { OptimizationSummary } from "./optimization-summary";

const AlertMessage = ({ type }: { type: "stop" | "driver" }) => {
  return (
    <Alert>
      <BellIcon className="h-4 w-4" />
      <AlertTitle>
        <span className="capitalize">{type}s</span> needed!{" "}
      </AlertTitle>
      <AlertDescription>{`Make sure to add some ${type}s before you generate your routes.`}</AlertDescription>
    </Alert>
  );
};

const CalculationsDynamicTab = () => {
  const locations = useStops((state) => state.locations);
  const drivers = useDrivers((state) => state.drivers);
  const { activeLocation } = useStops((state) => state);
  const { activeDriver } = useDrivers((state) => state);

  const { getRoutes } = useRouteOptimization();
  const { currentRoutingSolution } = useRoutingSolutions();

  return (
    <>
      {" "}
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Routes{" "}
            <span className="rounded-lg border border-slate-300 px-2">
              {currentRoutingSolution?.data?.routes?.length ?? 0}
            </span>
          </h2>
        </div>
        {drivers?.length === 0 && (
          <p>No drivers have been added to this route yet.</p>
        )}
      </div>
      <DriverSheet />
      <FulfillmentSheet />
      <ScrollArea className=" flex-1  px-4">
        {currentRoutingSolution && (
          <OptimizationSummary
            data={currentRoutingSolution?.data}
            className="mb-4"
          />
        )}
        {!currentRoutingSolution && (
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        )}
        {currentRoutingSolution && (
          <>
            {currentRoutingSolution?.data?.routes.map(
              (route: RouteData, idx: number) => (
                <MinimalRouteCard
                  key={idx}
                  data={route}
                  textColor={route.vehicle}
                />
              )
            )}
          </>
        )}{" "}
      </ScrollArea>
    </>
  );
};

export default CalculationsDynamicTab;
