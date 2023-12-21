/* eslint-disable react-hooks/exhaustive-deps */
import { Check } from "lucide-react";

import { Card } from "~/components/ui/card";

import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
} from "~/components/ui/map-sheet";

import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { useDepot } from "~/hooks/routing/use-depot";
import { api } from "~/utils/api";
import { getColor } from "~/utils/routing/color-handling";

import axios from "axios";

import { RouteQRDialog } from "~/apps/solidarity-routing/components/dialogs/qr/route-qr-dialog";
import { cn } from "~/utils/styles";
import type { ExpandedRouteData, StepData } from "../types";

import RouteBreakdown from "./route-breakdown";
import RouteHeaderCard from "./route-header-card";

interface CardProps extends React.ComponentProps<typeof Card> {
  data: ExpandedRouteData;
  handleOnStopClick?: (stop: StepData | null) => void;
}

interface ExtendedStepData extends StepData {
  status?: "pending" | "success" | "failed";
  deliveryNotes?: string;
}
interface MinimalCardProps extends CardProps {
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
  steps?: ExtendedStepData[];
}

export function MinimalRouteCard({
  data,
  textColor,
  className,
  isOnline = false,
  isTracking = false,

  ...props
}: MinimalCardProps) {
  const { address: startingAddress } = JSON.parse(data.description ?? "{}");

  const numberOfStops = data?.steps?.filter(
    (step) => step.type === "job"
  ).length;

  const [onOpen, setOnOpen] = useState(false);
  const color = getColor(textColor!).background;
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

  const [routeSteps, setRouteSteps] = useState<ExtendedStepData[]>([]);

  const { setSelectedRoute } = useDepot((state) => state);

  // const router = useRouter();
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
    // if (!toggle) setSelectedRoute(null);
    // if (toggle) setSelectedRoute(data);

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
            startingAddress={startingAddress}
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
}
