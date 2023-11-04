import { BellIcon } from "@radix-ui/react-icons";
import { Accordion } from "~/components/ui/accordion";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

import { useDrivers } from "~/hooks/routing/use-drivers";
import useRouteOptimization from "~/hooks/routing/use-route-optimization";
import { useRoutingSolutions } from "~/hooks/routing/use-routing-solutions";
import { useStops } from "~/hooks/routing/use-stops";

import { Button } from "~/components/ui/button";
import type { RouteData } from "../types";

import { ScrollArea } from "~/components/ui/scroll-area";
import DriverSheet from "../drivers/driver_sheet";
import FulfillmentSheet from "../stops/fulfillment_sheet";
import { MinimalRouteCard } from "./minimal-route-card";
import { OptimizationSummary } from "./optimization-summary";
/**
 * This component is responsible for displaying the calculated routes from the our own VROOM optimization server.
 */
const CalculationsTab = () => {
  const locations = useStops((state) => state.locations);
  const drivers = useDrivers((state) => state.drivers);
  const { activeLocation } = useStops((state) => state);
  const { activeDriver } = useDrivers((state) => state);

  const { getRoutes } = useRouteOptimization();
  const { currentRoutingSolution } = useRoutingSolutions();

  return (
    <>
      {locations?.length === 0 && <AlertMessage type={"stop"} />}
      {drivers?.length === 0 && <AlertMessage type={"driver"} />}
      <DriverSheet driver={activeDriver} />
      <FulfillmentSheet stop={activeLocation} />
      <div className="mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow">
        <Button
          onClick={() => void getRoutes()}
          className="w-full"
          disabled={locations.length === 0 || drivers.length === 0}
        >
          {currentRoutingSolution ? "Regenerate" : "Generate"} my routes
        </Button>
      </div>

      {currentRoutingSolution && (
        <OptimizationSummary data={currentRoutingSolution?.data} />
      )}

      {/* {currentRoutingSolution && (
        <Accordion
          type="single"
          collapsible
          className="flex h-full w-full grow flex-col justify-start gap-4 overflow-y-auto p-4 py-3 "
        >
          {currentRoutingSolution?.data?.routes.map(
            (route: RouteData, idx: number) => (
              <MinimalRouteCard key={idx} data={route} textColor={idx} />
            )
          )}
        </Accordion>
      )} */}

      {currentRoutingSolution && (
        <ScrollArea className="my-4 w-full flex-1 rounded-md border">
          {currentRoutingSolution?.data?.routes.map(
            (route: RouteData, idx: number) => (
              <MinimalRouteCard key={idx} data={route} textColor={idx} />
            )
          )}
        </ScrollArea>
      )}
    </>
  );
};

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
export default CalculationsTab;
