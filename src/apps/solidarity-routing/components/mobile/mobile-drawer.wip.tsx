import { RouteStatus } from "@prisma/client";
import { 
  Check, 
  MessageSquare,
  LocateOffIcon,
  LocateFixedIcon,
  LocateIcon,
  MapPinIcon
} from "lucide-react";
import { useState, useEffect } from "react";
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
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { useOptimizedRoutePlan } from "../../hooks/optimized-data/use-optimized-route-plan";

import { useSolidarityMessaging } from "../../hooks/use-solidarity-messaging";
import type { OptimizedStop } from "../../types.wip";
import { getColor } from "../../utils/generic/color-handling";
import {
  cuidToIndex,
  metersToMiles,
  unixSecondsToStandardTime,
} from "../../utils/generic/format-utils.wip";
import { FieldJobSearch } from "../field-job-search.wip";

import { useMediaQuery } from "~/hooks/use-media-query";
import RouteBreakdown from "../route-plan-section/route-breakdown";

import { Expand, Locate } from "lucide-react";
import { useMapStore } from '~/apps/solidarity-routing/stores/use-map-store';

export const MobileDrawer = ({}: // snap,
// setSnap,
{
  // snap: number | string | null;
  // setSnap: (snap: number | string | null) => void;
}) => {
  const { 
    flyToDriver, 
    setFlyToDriver, 
    constantTracking, 
    setConstantTracking,
    locationMessage // use-map.tsx uses setLocationMessage
  } = useMapStore();

  const toggleFlyToTimer = () => {
    console.log("Should be changing the button text!")
    setFlyToDriver(!flyToDriver)
  };

  const toggleConstantTracking = () => {
    setConstantTracking(!constantTracking)
  };

  const [snap, setSnap] = useState<number | string | null>(0.25);

  const optimizedRoutePlan = useOptimizedRoutePlan();
  const solidarityMessaging = useSolidarityMessaging();

  const [open, setOpen] = useState(false);

  const driverBundles = useDriverVehicleBundles();

  const driver = driverBundles.getVehicleById(
    optimizedRoutePlan?.data?.vehicleId
  );

  const route = optimizedRoutePlan?.data;

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const [hasPriorSuccess, setHasPriorSuccess] = useState(false);

  useEffect(() => {
    if (locationMessage.message === "success" && !locationMessage.error) {
      setHasPriorSuccess(true);
    }
  }, [locationMessage]);

  // Exporting a message for @map-view-button to display the Location Services state
  const exportLocationServiceMessage = () => {
    if (!constantTracking) {
      return "GPS";
    } 
    if (locationMessage.message.includes("initial")) {
      return "🏁 GPS";
    } else if (locationMessage.message.includes("timed out")) {
      return "GPS 👀 ";
    } else if (locationMessage.message.includes("success")) {
      if (!locationMessage.error && !hasPriorSuccess) {
        setHasPriorSuccess(true);
        return "GPS 🤷🏾 ";
      } else if (!locationMessage.error && hasPriorSuccess) {
        return "GPS 👍🏾";
      }
    } else {
      return "Locating GPS...";
    }
  };

  return (
    <>
      <div className="flex w-full bg-white lg:hidden">
      <Button
          className={cn(
            locationMessage.error && "bg-red-300",
            locationMessage.message.includes("timed") && "animate-pulse"
          )}
          variant={constantTracking ? "secondary" : "default"}
          onClick={() => {
            toggleConstantTracking()
          }}
        >
          {exportLocationServiceMessage()}
        </Button>

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
        {/* <FieldJobSearch isIcon={true} />{" "} */}

        <Button
          className=""
          onClick={toggleFlyToTimer}
        >
        {flyToDriver ? <LocateFixedIcon/> : <LocateOffIcon />}
      </Button>


      </div>
      <Drawer
        snapPoints={[0.1, 0.25, 0.75, 1]}
        activeSnapPoint={snap}
        setActiveSnapPoint={setSnap}
        open={isDesktop ? false : open}
        // dismissible={false}
        modal={false}
        onOpenChange={setOpen}
      >
        <DrawerContent
          className="h-screen"
          onInteractOutside={(e) => e.preventDefault()}
        >
          <div className="mx-auto w-full max-w-sm">
            <DrawerHeader className="flex flex-1 items-center justify-between">
              {snap === 0.1 ? (
                <>
                  <p className="text-sm font-normal text-muted-foreground">
                    Shift: {unixSecondsToStandardTime(route?.startTime ?? 0)} -{" "}
                    {unixSecondsToStandardTime(route?.endTime ?? 0)} •{" "}
                    {route?.stops?.length} stops •{" "}
                    {Math.round(metersToMiles(route?.distance ?? 0))}mi
                  </p>
                  <FieldJobSearch isIcon={true} />{" "}
                </>
              ) : (
                <FieldJobSearch isIcon={false} />
              )}
              {/* <FieldJobSearch isIcon={false} /> */}

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

                <Button
                  variant="outline"
                  className="px-3 shadow-none"
                  disabled={!driver?.driver?.email}
                  onClick={() => {
                    console.log(driver?.driver?.email);
                    if (!driver?.driver?.email) return;
                    solidarityMessaging.messageDepot(driver?.driver?.email);
                  }}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Open Messaging
                </Button>
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
