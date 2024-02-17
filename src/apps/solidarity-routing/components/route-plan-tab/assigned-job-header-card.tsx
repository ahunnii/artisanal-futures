import type { FC } from "react";
import React from "react";

import { ChevronRight } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { cn } from "~/utils/styles";

import OnlineIndicator from "~/apps/solidarity-routing/components/ui/online-indicator";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { RouteStatus } from "@prisma/client";
import type { OptimizedRoutePath } from "~/apps/solidarity-routing/types.wip";
import { formatWord } from "../../utils/format-word";
import {
  metersToMiles,
  unixSecondsToStandardTime,
} from "../../utils/generic/format-utils.wip";

type RouteHeaderCardProps = {
  routeStatus: string;
  startTime: number | null;
  endTime: number | null;
  distance: number | null;
  vehicleId: string;
  textColor?: string;
  isOnline?: boolean;
  isTracking?: boolean;
  isButton?: boolean;
} & React.ComponentProps<typeof CardHeader>;

export const AssignedJobHeaderCard: FC<RouteHeaderCardProps> = ({
  vehicleId,
  startTime,
  routeStatus,
  endTime,
  distance,
  textColor,
  className,
  isOnline = false,
  isButton = false,
}) => {
  const driverBundles = useDriverVehicleBundles();
  const driverBundle = driverBundles.getVehicleById(vehicleId);

  const status = formatWord(routeStatus);

  return (
    <>
      <CardHeader
        className={cn(
          "flex w-full flex-row items-center justify-between py-1 shadow-inner",
          className
        )}
      >
        <div>
          <CardTitle className="flex  flex-row items-center gap-4 text-sm ">
            <div className={cn("flex basis-2/3 font-bold", textColor)}>
              {driverBundle?.driver?.name}
              {/* {routeStatus && "✅"} */}
            </div>
            {isOnline && <OnlineIndicator />}
          </CardTitle>
          <CardDescription className="text-xs">
            <span className="normal-case">{status}</span> •{" "}
            {unixSecondsToStandardTime(startTime ?? 0)} to{" "}
            {unixSecondsToStandardTime(endTime ?? 0)} •{" "}
            {Math.round(metersToMiles(distance ?? 0))}mi
          </CardDescription>{" "}
        </div>
        {isButton && (
          <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
        )}
      </CardHeader>
    </>
  );
};
