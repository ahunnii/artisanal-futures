import { Button } from "~/components/ui/button";
import {
  CardDescription,
  CardHeader,
  CardTitle,
  type Card,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

import { getColor } from "~/utils/routing/color-handling";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import { convertSecondsToTime } from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { ExtendedStepData, RouteData, StepData } from "../types";

import { useDriverRoute } from "~/hooks/routing/use-driver-routes";
import OnlineIndicator from "./online-indicator";
import StepLineSegment from "./step-line-segment";

interface CardProps extends React.ComponentProps<typeof Card> {
  data: RouteData;
  handleOnStopClick?: (stop: StepData | null) => void;
}

interface MinimalCardProps extends CardProps {
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
  steps: ExtendedStepData[];
}

export function DriverRouteBreakdown({
  data,
  steps,
  textColor,
  isOnline = false,
}: MinimalCardProps) {
  const { name: driverName, address: startingAddress } = JSON.parse(
    data.description ?? "{}"
  );

  const startTime = convertSecondsToTime(data?.steps?.[0]?.arrival ?? 0);
  const endTime = convertSecondsToTime(
    (data?.steps?.[0]?.arrival ?? 0) +
      data?.setup +
      data?.service +
      data?.waiting_time +
      data?.duration
  );

  const numberOfStops = data?.steps?.filter(
    (step) => step.type === "job"
  ).length;

  let jobIndex = 0;

  const color = getColor(textColor!).background;
  const colorText = getColor(textColor!).text;

  const { setSelectedStop } = useDriverRoute((state) => state);

  return (
    <>
      <CardHeader className="flex flex-row items-center justify-between py-1 pt-3 shadow-inner">
        <div>
          <CardTitle className="flex  flex-row items-center gap-4 text-base ">
            <div className={cn("flex basis-2/3 font-bold", colorText)}>
              {driverName}
            </div>
            {isOnline && <OnlineIndicator />}
          </CardTitle>
          <CardDescription>
            {startTime} to {endTime} • {numberOfStops} stops •{" "}
            {convertMetersToMiles(data?.distance)} miles
          </CardDescription>{" "}
        </div>
      </CardHeader>
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
    </>
  );
}
