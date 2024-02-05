/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useMemo, useState, type FC } from "react";

import axios from "axios";
import { Check } from "lucide-react";
import toast from "react-hot-toast";

import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/map-sheet";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

import { RouteQRDialog } from "~/apps/solidarity-routing/components/qr/route-qr-dialog";
import RouteBreakdown from "~/apps/solidarity-routing/components/ui/cards/route-breakdown";
import RouteHeaderCard from "~/apps/solidarity-routing/components/ui/cards/route-header-card";

import { getColor } from "~/apps/solidarity-routing/libs/color-handling";
import type {
  ExpandedRouteData,
  ExtendedStepData,
} from "~/apps/solidarity-routing/types";
import { useFinalizedRoutes } from "../../hooks/use-finalized-routes";

type TInteractiveProps = {
  data: ExpandedRouteData;
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
} & React.ComponentProps<typeof Card>;

const InteractiveRouteCard: FC<TInteractiveProps> = ({
  data,
  textColor,
  className,
  isOnline = false,
  isTracking = false,
  ...props
}) => {
  const [onOpen, setOnOpen] = useState<boolean>(false);
  const [routeSteps, setRouteSteps] = useState<ExtendedStepData[]>([]);

  const { setSelectedRoute } = useFinalizedRoutes((state) => state);

  const numberOfStops = data?.steps?.filter(
    (step) => step.type === "job"
  ).length;

  const { vehicleId, driverId } = JSON.parse(data.description ?? "{}");

  const color = useMemo(() => getColor(textColor!).background, [textColor]);

  const apiContext = api.useContext();

  const { mutate } = api.finalizedRoutes.createFinalizedRoute.useMutation({
    onError: (error) => {
      toast.error(error.message);
      console.error(error);
    },
  });

  const { mutate: updateFinalizedRouteStatus } =
    api.finalizedRoutes.updateFinalizedRouteStatus.useMutation({
      onError: (error) => {
        toast.error(error.message);
        console.error(error);
      },
      onSettled: () => {
        void apiContext.finalizedRoutes.getAllFormattedFinalizedRoutes.invalidate();
        void axios.post("/api/realtime/test-message");
        setOnOpen(false);
      },
    });

  const archiveRouteAndRefetch = () => {
    if (!isTracking || !data?.routeId) return;

    updateFinalizedRouteStatus({
      routeId: data?.routeId,
      status: "COMPLETED",
    });
  };

  useEffect(() => {
    if (!data) return;
    setRouteSteps(data.steps);
    if (!isTracking) mutate(data);
  }, [data, isTracking]);

  const routeStatus = useMemo(() => {
    const temp = routeSteps?.filter(
      (step) => step.status && step.status !== "pending" && step.type === "job"
    ).length;

    return temp === numberOfStops;
  }, [routeSteps, numberOfStops]);

  const handleOnOpenChange = (toggle: boolean) => {
    setSelectedRoute(toggle ? data : null);
    setOnOpen(toggle);
  };

  const handleOnOpen = () => {
    setSelectedRoute(data);
    setOnOpen(true);
  };

  return (
    <>
      <Button
        variant={"ghost"}
        className="my-2 ml-auto  flex h-auto  w-full p-0 text-left"
        onClick={handleOnOpen}
      >
        <Card className={cn("w-full hover:bg-slate-50", className)} {...props}>
          <RouteHeaderCard
            data={data}
            textColor={textColor}
            isButton={true}
            isOnline={isOnline}
          />
        </Card>
      </Button>
      <Sheet onOpenChange={handleOnOpenChange} open={onOpen}>
        <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
          <SheetHeader className="text-left">
            <RouteHeaderCard
              data={data}
              textColor={textColor}
              className="shadow-none"
            />
          </SheetHeader>
          <RouteBreakdown
            steps={routeSteps}
            color={color}
            startingAddress={data.description}
          />
          <SheetFooter>
            {isTracking ? (
              <Button
                className={cn(
                  "flex w-full items-center gap-1",
                  routeStatus && "bg-green-500"
                )}
                onClick={archiveRouteAndRefetch}
              >
                <Check className="h-5 w-5 " />
                Mark Route as Complete
              </Button>
            ) : (
              <RouteQRDialog data={data} />
            )}{" "}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default InteractiveRouteCard;
