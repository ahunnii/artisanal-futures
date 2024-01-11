import { ReloadIcon } from "@radix-ui/react-icons";

import DriverSheet from "~/apps/solidarity-routing/components/drivers/driver-sheet";
import { OptimizationSummary } from "~/apps/solidarity-routing/components/solutions/optimization-summary";
import StopSheet from "~/apps/solidarity-routing/components/stops/fulfillment-sheet";

import { ScrollArea } from "~/components/ui/scroll-area";

import { useRoutingSolutions } from "~/apps/solidarity-routing/hooks/use-routing-solutions";

import InteractiveRouteCard from "~/apps/solidarity-routing/components/solutions/interactive-route-card";
import type { RouteData } from "~/components/tools/routing/types";

const CalculationsTab = () => {
  const { currentRoutingSolution } = useRoutingSolutions();

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Routes{" "}
            <span className="rounded-lg border border-slate-300 px-2">
              {currentRoutingSolution?.data?.routes?.length ?? 0}
            </span>
          </h2>
        </div>
      </div>
      <DriverSheet />
      <StopSheet />
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
                <InteractiveRouteCard
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

export default CalculationsTab;
