import { MessageCircle } from "lucide-react";
import { useMemo, useState, type FC } from "react";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { cn } from "~/utils/styles";

import Link from "next/link";

import { AssignedJobHeaderCard } from "~/apps/solidarity-routing/components/route-plan-section/assigned-job-header-card";
import RouteBreakdown from "~/apps/solidarity-routing/components/route-plan-section/route-breakdown";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import type {
  OptimizedRoutePath,
  OptimizedStop,
} from "~/apps/solidarity-routing/types.wip";
import { getColor } from "~/apps/solidarity-routing/utils/generic/color-handling";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";
import { useSolidarityMessaging } from "../../hooks/use-solidarity-messaging";

type Props = {
  data: OptimizedRoutePath;
} & React.ComponentProps<typeof Card>;

export const AssignedJobSheet: FC<Props> = ({ data }) => {
  const [open, setOpen] = useState(false);
  const driverBundles = useDriverVehicleBundles();
  const solidarityMessaging = useSolidarityMessaging();
  const { depotId } = useSolidarityState();

  const color = useMemo(() => getColor(cuidToIndex(data.vehicleId)), [data]);

  const headerData = {
    vehicleId: data.vehicleId,
    startTime: data.startTime,
    routeStatus: data.status,
    endTime: data.endTime,
    distance: data.distance,
    textColor: color?.text ?? "text-black",
    isOnline: false,
    isTracking: false,
  };
  const driver = driverBundles.getVehicleById(
    data?.vehicleId ?? data.vehicleId
  );

  const onRouteSheetOpenChange = (state: boolean) => {
    if (!state) driverBundles.setActive(null);
    else driverBundles.setActive(data.vehicleId);
    setOpen(state);
  };
  return (
    <>
      <Sheet onOpenChange={onRouteSheetOpenChange} open={open}>
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            className="my-2 ml-auto  flex h-auto  w-full p-0 text-left"
          >
            <Card className={cn("w-full hover:bg-slate-50", "")}>
              <AssignedJobHeaderCard {...headerData} />
            </Card>
          </Button>
        </SheetTrigger>

        {data && (
          <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
            <SheetHeader className="text-left">
              <AssignedJobHeaderCard {...headerData} className="shadow-none" />
            </SheetHeader>
            <RouteBreakdown
              steps={data.stops as OptimizedStop[]}
              color={color.background}
              driver={driver}
            />
            <SheetFooter className="flex flex-row gap-2">
              <Button
                className="flex flex-1 gap-2"
                variant={"outline"}
                disabled={!driver?.driver?.email}
                onClick={() => {
                  if (!driver?.driver?.email) return;
                  solidarityMessaging.messageDriver(driver?.driver?.email);
                }}
              >
                <MessageCircle /> Send Message to {driver?.driver?.name}
              </Button>

              <Link
                href={`/tools/solidarity-pathways/${depotId}/route/${data.routeId}/path/${data.id}`}
              >
                <Button className="">View Route</Button>
              </Link>
            </SheetFooter>
          </SheetContent>
        )}
      </Sheet>
    </>
  );
};
