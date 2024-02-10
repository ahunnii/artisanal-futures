import type { FC } from "react";

import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";

import StepLineSegment from "~/apps/solidarity-routing/components/ui/step-line-segment";

import type {
  DriverVehicleBundle,
  OptimizedStop,
} from "~/apps/solidarity-routing/types.wip";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

type RouteBreakdownProps = {
  driver: DriverVehicleBundle | null | undefined;
  steps: OptimizedStop[];
  color: string | undefined;
};

/**
 * Acts as a timeline breakdown for each stop in the route.
 */
const RouteBreakdown: FC<RouteBreakdownProps> = ({ driver, steps, color }) => {
  // const { setSelectedStop } = useDriverRoute((state) => state);

  const jobBundles = useClientJobBundles();

  let jobIndex = 0;

  const startAddress = driver?.vehicle?.startAddress?.formatted ?? "";
  const endAddress =
    driver?.vehicle?.endAddress?.formatted ??
    driver?.vehicle?.startAddress?.formatted ??
    "";

  return (
    <ScrollArea className="flex-1 bg-slate-50 shadow-inner">
      <div className="w-full px-4 ">
        {steps?.length > 0 &&
          steps?.map((step, idx) => {
            return (
              <div key={idx} className="w-full">
                {step.type === "job" && (
                  <Button
                    className="m-0  ml-auto flex  h-auto w-full  p-0"
                    variant={"ghost"}
                    onClick={() => jobBundles.view(step.jobId)}
                  >
                    <StepLineSegment
                      step={step}
                      idx={++jobIndex}
                      color={color}
                    />{" "}
                  </Button>
                )}
                {step.type === "break" && (
                  <StepLineSegment step={step} color={color} />
                )}
                {step.type === "start" && (
                  <StepLineSegment
                    step={step}
                    shiftStartAddress={startAddress}
                    color={color}
                  />
                )}{" "}
                {step.type === "end" && (
                  <StepLineSegment
                    step={step}
                    shiftEndAddress={endAddress}
                    color={color}
                  />
                )}
              </div>
            );
          })}
      </div>
    </ScrollArea>
  );
};

export default RouteBreakdown;
