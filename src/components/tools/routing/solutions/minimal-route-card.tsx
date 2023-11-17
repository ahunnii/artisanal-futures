import { Check, ChevronRight } from "lucide-react";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

import { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { useDepot } from "~/hooks/routing/use-depot";
import { getColor } from "~/utils/routing/color-handling";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import { archiveRoute, fetchAllRoutes } from "~/utils/routing/supabase-utils";
import { convertSecondsToTime } from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { ExpandedRouteData, PusherMessage, StepData } from "../types";
import { DynamicRouteQRModal } from "../ui/RouteQRModal";
import StepLineSegment from "./step-line-segment";

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
  const { name: driverName, address: startingAddress } = JSON.parse(
    data.description ?? "{}"
  );

  const startTime = convertSecondsToTime(data?.steps?.[0]?.arrival ?? 0);
  const endTime = convertSecondsToTime(
    (data?.steps?.[0]?.arrival ?? 0) +
      data?.setup +
      data?.service +
      data?.waiting_time +
      data?.duration
  );

  const numberOfStops = data?.steps?.filter(
    (step) => step.type === "job"
  ).length;

  let jobIndex = 0;

  const [onOpen, setOnOpen] = useState(false);
  const color = getColor(textColor!).background;

  const [routeSteps, setRouteSteps] = useState<ExtendedStepData[]>([]);

  const { setRoutes } = useDepot((state) => state);

  const router = useRouter();
  const archiveRouteAndRefetch = () => {
    if (!isTracking || !data?.routeId) return;
    archiveRoute(data?.routeId)
      .then(() => {
        fetchAllRoutes(setRoutes);
        router.reload();
      })
      .catch(console.error);
  };

  useEffect(() => {
    if (data) setRouteSteps(data?.steps);
  }, [data]);

  useEffect(() => {
    if (messages?.length > 0 && routeSteps) {
      const temp = messages.map((message) => message.stopId);

      const temp2 = routeSteps.map((step) => {
        return temp.includes(step.job!) ? { ...step, status: "success" } : step;
      });

      setRouteSteps(temp2 as ExtendedStepData[]);
    }
  }, [messages]);

  const routeStatus = useMemo(() => {
    const temp = routeSteps?.filter(
      (step) => step.status && step.status !== "pending" && step.type === "job"
    ).length;

    return temp === numberOfStops;
  }, [routeSteps, numberOfStops]);

  const distance = convertMetersToMiles(data?.distance);
  const colorText = getColor(textColor!).text;

  return (
    <>
      <Card
        className={cn("w-full cursor-pointer hover:bg-slate-50", className)}
        {...props}
        onClick={() => setOnOpen(true)}
      >
        <CardHeader className="flex flex-row items-center justify-between py-1">
          <div>
            <CardTitle className="flex  flex-row items-center gap-4 text-base ">
              <div className={cn("flex basis-2/3 font-bold", colorText)}>
                {driverName} {routeStatus && "✅"}
              </div>
              {isOnline && (
                <div className="flex basis-1/3 items-center gap-2">
                  <span className="text-sm text-green-500">Online</span>
                  <span className="relative flex h-3 w-3">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-3 w-3 rounded-full bg-green-500"></span>
                  </span>
                </div>
              )}
            </CardTitle>
            <CardDescription>
              {startTime} to {endTime} • {numberOfStops} stops • {distance}{" "}
              miles
            </CardDescription>
          </div>
          <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
        </CardHeader>
      </Card>
      <Sheet onOpenChange={setOnOpen} open={onOpen}>
        <SheetContent className="flex flex-1 flex-col">
          <SheetHeader>
            <SheetTitle>
              Route for <span className={cn(colorText)}>{driverName}</span>
            </SheetTitle>
            <SheetDescription>
              {startTime} to {endTime} • {numberOfStops} stops • {distance}{" "}
              miles
            </SheetDescription>
          </SheetHeader>{" "}
          <ScrollArea className="flex-1 bg-slate-50 shadow-inner">
            <div className="w-full px-4 ">
              {routeSteps?.length > 0 &&
                routeSteps?.map((step, idx) => {
                  return (
                    <div key={idx} className="w-full">
                      {step.type === "job" && (
                        <StepLineSegment
                          step={step}
                          idx={++jobIndex}
                          color={color}
                        />
                      )}
                      {(step.type === "start" ||
                        step.type === "end" ||
                        step.type === "break") && (
                        <StepLineSegment
                          step={step}
                          addressRoundTrip={startingAddress}
                          color={color}
                        />
                      )}
                    </div>
                  );
                })}
            </div>
          </ScrollArea>
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
