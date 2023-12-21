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

import { cn } from "~/utils/styles";
import type { ExpandedRouteData, PusherMessage, StepData } from "../types";
import { DynamicRouteQRModal } from "../ui/RouteQRModal";

import { DriverDispatchMessaging } from "../ui/driver-dispatch-messaging";
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
  messages?: PusherMessage[];
}

export function MinimalRouteCard({
  data,
  textColor,
  className,
  isOnline = false,
  isTracking = false,

  messages = [],
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
        console.log("etereed");
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

  // useEffect(() => {
  //   if (messages?.length > 0 && routeSteps) {
  //     const temp = messages.map((message) => message.stopId);

  //     const temp2 = routeSteps.map((step) => {
  //       return temp.includes(step.job!) ? { ...step, status: "success" } : step;
  //     });

  //     setRouteSteps(temp2 as ExtendedStepData[]);
  //   }
  // }, [messages]);

  const routeStatus = useMemo(() => {
    const temp = routeSteps?.filter(
      (step) => step.status && step.status !== "pending" && step.type === "job"
    ).length;

    return temp === numberOfStops;
  }, [routeSteps, numberOfStops]);

  const handleOnOpenChange = (toggle: boolean) => {
    console.log(toggle);
    if (!toggle) setSelectedRoute(null);
    if (toggle) setSelectedRoute(data);
    setOnOpen(toggle);
  };

  const handleOnOpen = () => {
    setSelectedRoute(data);
    setOnOpen(true);
  };
  const { name: driverName } = JSON.parse(data.description ?? "{}");
  return (
    <>
      {" "}
      <Button
        variant={"ghost"}
        className="my-2 ml-auto  flex h-auto  w-full p-0 text-left"
        onClick={handleOnOpen}
      >
        <Card className={cn("w-full  hover:bg-slate-50", className)} {...props}>
          {/* <div className="flex w-full items-center justify-between pr-5">
     
            {" "} */}
          <RouteHeaderCard
            data={data}
            textColor={textColor}
            isButton={true}
            isOnline={isOnline}
          />{" "}
          {/* <DriverDispatchMessaging recipient={"driver"} route={data} />
        </div> */}
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
          </SheetHeader>{" "}
          <RouteBreakdown
            steps={routeSteps}
            color={color}
            startingAddress={startingAddress}
          />
          <SheetFooter>
            {!isTracking && <DynamicRouteQRModal data={data} />}
            {isTracking && (
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
            )}{" "}
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
}
