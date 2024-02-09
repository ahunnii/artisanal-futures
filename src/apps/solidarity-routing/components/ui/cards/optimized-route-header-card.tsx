import type { FC } from "react";
import React, { useMemo } from "react";

import { ChevronRight } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { cn } from "~/utils/styles";

import OnlineIndicator from "~/apps/solidarity-routing/components/ui/online-indicator";
import { getColor } from "~/apps/solidarity-routing/libs/color-handling";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { convertSecondsToTime } from "~/apps/solidarity-routing/libs/time-formatting";
import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";
import { OptimizedRoutePath } from "~/apps/solidarity-routing/types.wip";
import {
  metersToMiles,
  unixSecondsToMilitaryTime,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

type RouteHeaderCardProps = {
  route: OptimizedRoutePath;

  textColor?: string;
  isOnline?: boolean;
  isTracking?: boolean;
  isButton?: boolean;
} & React.ComponentProps<typeof CardHeader>;

export const OptimizedRouteHeaderCard: FC<RouteHeaderCardProps> = ({
  route,
  textColor,
  className,
  isOnline = false,
  isButton = false,
}) => {
  const driverBundles = useDriverVehicleBundles();
  const driverBundle = driverBundles.getVehicleById(route.vehicleId as string);

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
            <div className={cn("flex basis-2/3 font-bold", textColor)}>
              {driverBundle?.driver?.name}
              {/* {routeStatus && "✅"} */}
            </div>
            {isOnline && <OnlineIndicator />}
          </CardTitle>
          <CardDescription>
            Not started • xx:xx to xx:xx • xxx mi
          </CardDescription>{" "}
        </div>
        {isButton && (
          <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
        )}
      </CardHeader>
    </>
  );
};
