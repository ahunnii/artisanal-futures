import type { FC } from "react";

import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { getColor } from "~/utils/routing/color-handling";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import { convertSecondsToTime } from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { ExpandedRouteData, ExtendedStepData } from "../types";

import { ChevronRight } from "lucide-react";
import React, { useMemo } from "react";

import OnlineIndicator from "./online-indicator";

type RouteHeaderCardProps = {
  data: ExpandedRouteData;
  handleOnStopClick?: (stop: ExtendedStepData | null) => void;
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
  isButton?: boolean;
} & React.ComponentProps<typeof CardHeader>;

const RouteHeaderCard: FC<RouteHeaderCardProps> = ({
  data,
  textColor,
  className,
  isOnline = false,
  isButton = false,
}) => {
  const { name: driverName } = JSON.parse(data.description ?? "{}");

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

  const colorText = getColor(textColor!).text;

  const routeStatus = useMemo(() => {
    const temp = data?.steps?.filter(
      (step) => step.status && step.status !== "pending" && step.type === "job"
    ).length;

    return temp === numberOfStops;
  }, [data?.steps, numberOfStops]);

  return (
    <>
      <CardHeader
        className={cn(
          "flex w-full flex-row items-center justify-between py-1 pt-3 shadow-inner",
          className
        )}
      >
        <div>
          <CardTitle className="flex  flex-row items-center gap-4 text-base ">
            <div className={cn("flex basis-2/3 font-bold", colorText)}>
              {driverName} {routeStatus && "✅"}
            </div>
            {isOnline && <OnlineIndicator />}
          </CardTitle>
          <CardDescription>
            {startTime} to {endTime} • {numberOfStops} stops •{" "}
            {convertMetersToMiles(data?.distance)} miles
          </CardDescription>{" "}
        </div>
        {isButton && (
          <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
        )}
      </CardHeader>
    </>
  );
};

export default RouteHeaderCard;
