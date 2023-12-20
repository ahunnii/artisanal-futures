import { FC } from "react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useDriverRoute } from "~/hooks/routing/use-driver-routes";
import { ExtendedStepData } from "../types";
import StepLineSegment from "./step-line-segment";

type RouteBreakdownProps = {
  steps: ExtendedStepData[];
  color: string | undefined;
  startingAddress: string;
};
const RouteBreakdown: FC<RouteBreakdownProps> = ({
  steps,
  color,
  startingAddress,
}) => {
  const { setSelectedStop } = useDriverRoute((state) => state);

  let jobIndex = 0;

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
                    onClick={() => setSelectedStop(step)}
                  >
                    <StepLineSegment
                      step={step}
                      idx={++jobIndex}
                      color={color}
                    />{" "}
                  </Button>
                )}

                {(step.type === "start" ||
                  step.type === "end" ||
                  step.type === "break") && (
                  <StepLineSegment
                    step={step}
                    addressRoundTrip={startingAddress}
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
