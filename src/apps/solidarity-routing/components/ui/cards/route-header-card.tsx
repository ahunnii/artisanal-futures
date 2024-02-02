import type { FC } from "react";
import React, { useMemo } from "react";

import { ChevronRight } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { cn } from "~/utils/styles";

import OnlineIndicator from "~/apps/solidarity-routing/components/ui/online-indicator";
import { getColor } from "~/apps/solidarity-routing/libs/color-handling";

import { convertSecondsToTime } from "~/apps/solidarity-routing/libs/time-formatting";
import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";
import { metersToMiles } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

type RouteHeaderCardProps = {
  data: ExpandedRouteData;

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
            {metersToMiles(data?.distance)} miles
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
