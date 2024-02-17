import { RouteStatus } from "@prisma/client";
import { Car, Check, MessageSquare, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
} from "~/components/ui/drawer";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/styles";
import { useDriverVehicleBundles } from "../hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "../hooks/optimized-data/use-optimized-route-plan";
import { useSolidarityMessaging } from "../hooks/use-solidarity-messaging";
import type { OptimizedStop } from "../types.wip";
import { getColor } from "../utils/generic/color-handling";
import {
  cuidToIndex,
  metersToMiles,
  unixSecondsToStandardTime,
} from "../utils/generic/format-utils.wip";
import { FieldJobSearch } from "./field-job-search.wip";
import { MessageSheet } from "./messaging/message-sheet";
import RouteBreakdown from "./route-plan-tab/route-breakdown";

export const MobileDrawer = () => {
  const optimizedRoutePlan = useOptimizedRoutePlan();

  const [open, setOpen] = useState(false);

  const driverBundles = useDriverVehicleBundles();

  const driver = driverBundles.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );
  const route = optimizedRoutePlan?.data;
  const [snap, setSnap] = useState<number | string | null>(0.22);

  return (
    <>
      <div className="flex w-full bg-white lg:hidden">
        <Button
          size={"lg"}
          variant="ghost"
          className="flex-1"
          onClick={() => setOpen(true)}
        >
          <p className="text-sm font-normal text-muted-foreground">
            Shift: {unixSecondsToStandardTime(route?.startTime ?? 0)} -{" "}
            {unixSecondsToStandardTime(route?.endTime ?? 0)} •{" "}
            {route?.stops?.length} stops •{" "}
            {Math.round(metersToMiles(route?.distance ?? 0))}mi
          </p>
        </Button>
        <FieldJobSearch isIcon={true} />{" "}
        {/* <Button
          size="icon"
          variant={"ghost"}
          className="font-normal text-muted-foreground "
        >
          <MoreVertical className="h-4 w-4" /> */}
        {/* </Button> */}
      </div>
      <Drawer
        snapPoints={[0.22, 0.8, 1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        open={open}
        onOpenChange={setOpen}
      >
        <DrawerContent className="h-screen">
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex justify-between">
              <FieldJobSearch isIcon={false} />

              {/* <Button
                size="icon"
                variant={"ghost"}
                className="font-normal text-muted-foreground "
              >
                <MoreVertical className="h-4 w-4" />
              </Button> */}
            </DrawerHeader>

            <div
              className={cn(
                "mx-auto flex h-[50vh] w-full max-w-md flex-col px-4  pb-4",
                {
                  "overflow-y-auto": snap === 1,
                  "overflow-hidden": snap !== 1,
                }
              )}
            >
              <p className="text-xs font-normal text-muted-foreground">
                Shift: {unixSecondsToStandardTime(route?.startTime ?? 0)} -{" "}
                {unixSecondsToStandardTime(route?.endTime ?? 0)} •{" "}
                {route?.stops?.length} stops •{" "}
                {Math.round(metersToMiles(route?.distance ?? 0))}mi
              </p>
              <h2 className="text-xl font-semibold">
                {optimizedRoutePlan.routeDetails?.deliveryAt.toDateString() ??
                  ""}
              </h2>
              <div className="flex py-1">
                {/* <Button className="flex items-center gap-2" variant={"outline"}>
                  <Car />
                  Load vehicle
                </Button> */}
                {/* 
<Button
              className="flex flex-1 gap-2"
              variant={"outline"}
              onClick={() => driverBundles.message(data.vehicleId)}
            >
              <MessageCircle /> Send Message to {driver?.driver?.name}
            </Button> */}

                <MessageSheet isDepot={false} currentDriver={driver}>
                  <Button variant="outline" className="px-3 shadow-none">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Open Messaging
                  </Button>
                </MessageSheet>
              </div>

              <Separator className="my-4" />
              {optimizedRoutePlan.data && (
                <RouteBreakdown
                  className="h-96 flex-none pb-5"
                  steps={optimizedRoutePlan.data.stops as OptimizedStop[]}
                  driver={driver}
                  color={
                    getColor(cuidToIndex(optimizedRoutePlan.data.vehicleId))
                      .background
                  }
                />
              )}
            </div>

            <DrawerFooter>
              {optimizedRoutePlan?.data?.status === RouteStatus.NOT_STARTED && (
                <Button
                  onClick={() => {
                    if (optimizedRoutePlan?.data?.id)
                      optimizedRoutePlan.updateRoutePathStatus({
                        pathId: optimizedRoutePlan.data.id,
                        state: RouteStatus.IN_PROGRESS,
                      });
                  }}
                >
                  Start route
                </Button>
              )}

              {optimizedRoutePlan?.data?.status === RouteStatus.IN_PROGRESS && (
                <Button
                  onClick={() => {
                    if (optimizedRoutePlan?.data?.id)
                      optimizedRoutePlan.updateRoutePathStatus({
                        pathId: optimizedRoutePlan.data.id,
                        state: RouteStatus.COMPLETED,
                      });
                  }}
                >
                  <Check /> Mark route as complete
                </Button>
              )}

              <DrawerClose asChild>
                <Button variant="outline">Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
};
