import type { FC } from "react";
import React from "react";

import { ChevronRight } from "lucide-react";

import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

import { cn } from "~/utils/styles";

import OnlineIndicator from "~/apps/solidarity-routing/components/ui/online-indicator";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import type { OptimizedRoutePath } from "~/apps/solidarity-routing/types.wip";

type RouteHeaderCardProps = {
  route: OptimizedRoutePath;

  textColor?: string;
  isOnline?: boolean;
  isTracking?: boolean;
  isButton?: boolean;
} & React.ComponentProps<typeof CardHeader>;

function formatWord(word: string): string {
  // Convert the word to lowercase and replace underscores with spaces
  const formattedWord = word.toLowerCase().replace(/_/g, " ");

  // Use regex to capitalize the first letter of each word
  return formattedWord.replace(/\b\w/g, (char) => char.toUpperCase());
}

export const OptimizedRouteHeaderCard: FC<RouteHeaderCardProps> = ({
  route,
  textColor,
  className,
  isOnline = false,
  isButton = false,
}) => {
  const driverBundles = useDriverVehicleBundles();
  const driverBundle = driverBundles.getVehicleById(route.vehicleId);

  const status = formatWord(route.status);

  return (
    <>
      <CardHeader
        className={cn(
          "flex w-full flex-row items-center justify-between py-1 pt-3 shadow-inner",
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
            <span className="normal-case">{status}</span> • xx:xx to xx:xx • xxx
            mi
          </CardDescription>{" "}
        </div>
        {isButton && (
          <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
        )}
      </CardHeader>
    </>
  );
};
