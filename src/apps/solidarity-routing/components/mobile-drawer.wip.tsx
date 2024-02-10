import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Car, Check, MoreVertical } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "~/components/ui/drawer";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/utils/styles";
import { useDriverVehicleBundles } from "../hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "../hooks/optimized-data/use-optimized-route-plan";
import { OptimizedStop } from "../types.wip";
import { getColor } from "../utils/generic/color-handling";
import {
  cuidToIndex,
  unixSecondsToStandardTime,
} from "../utils/generic/format-utils.wip";
import { FieldJobSearch } from "./field-job-search.wip";
import { MessageSheet } from "./messaging/message-sheet";
import RouteBreakdown from "./solutions/route-breakdown";

export const MobileDrawer = () => {
  const optimizedRoutePlan = useOptimizedRoutePlan();
  const [open, setOpen] = useState(false);

  const driverRoute = useDriverVehicleBundles();

  const driver = driverRoute.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );
  const [snap, setSnap] = useState<number | string | null>(0.22);

  return (
    <>
      <div className="flex w-full">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => setOpen(true)}
        >
          <p className="text-xs font-normal text-muted-foreground">
            Shift: {unixSecondsToStandardTime(driver?.vehicle?.shiftStart ?? 0)}{" "}
            - {unixSecondsToStandardTime(driver?.vehicle?.shiftEnd ?? 0)} •{" "}
            {optimizedRoutePlan?.data?.stops?.length} stops • XX mi
          </p>
        </Button>
        <FieldJobSearch isIcon={true} />{" "}
        <Button
          size="icon"
          variant={"ghost"}
          className="font-normal text-muted-foreground "
        >
          <MoreVertical className="h-4 w-4" />
        </Button>
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

              <Button
                size="icon"
                variant={"ghost"}
                className="font-normal text-muted-foreground "
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
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
                Shift:{" "}
                {unixSecondsToStandardTime(driver?.vehicle?.shiftStart ?? 0)} -{" "}
                {unixSecondsToStandardTime(driver?.vehicle?.shiftEnd ?? 0)} •{" "}
                {optimizedRoutePlan?.data?.stops?.length} stops • XX mi
              </p>
              <h2 className="text-xl font-semibold">
                {optimizedRoutePlan.routeDetails?.deliveryAt.toDateString() ??
                  ""}
              </h2>
              <div className="flex py-1">
                <Button className="flex items-center gap-2" variant={"outline"}>
                  <Car />
                  Load vehicle
                </Button>
                <MessageSheet />
              </div>

              <Separator className="my-4" />
              {optimizedRoutePlan.data && (
                <RouteBreakdown
                  className="h-96 flex-none"
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
              <Button>
                <Check /> Mark route as complete
              </Button>
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
