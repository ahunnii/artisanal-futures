import { useState, type ComponentProps } from "react";

import { CaretSortIcon } from "@radix-ui/react-icons";

import type { OptimizationData } from "~/apps/solidarity-routing/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";

import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import { convertSecondsToMinutesAndHours } from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";

interface CardProps extends ComponentProps<typeof Card> {
  data: OptimizationData;
}
export function OptimizationSummary({ data, className, ...props }: CardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { setActiveLocationById, setIsStopSheetOpen } = useStops(
    (state) => state
  );

  const duration = convertSecondsToMinutesAndHours(
    data?.summary?.duration
  ).formatted;

  const serviceTime = convertSecondsToMinutesAndHours(
    data?.summary?.service
  ).formatted;

  const millage = convertMetersToMiles(data?.summary?.distance);
  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle>Summary</CardTitle>
        <CardDescription>
          You have {data?.summary?.routes} calculated routes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid grid-cols-3">
          <div className=" flex grow items-center rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{duration}</p>
              <p className="text-sm text-muted-foreground">Travel Time</p>
            </div>
          </div>{" "}
          <div className=" flex grow items-center rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{serviceTime}</p>
              <p className="text-sm text-muted-foreground">Service Time</p>
            </div>
          </div>{" "}
          <div className=" flex grow items-center rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">{millage}mi</p>
              <p className="text-sm text-muted-foreground">Distance Covered</p>
            </div>
          </div>
        </div>
        <Separator />
        <div>
          <CardTitle className=" text-lg">Unassigned</CardTitle>
          <CardDescription>
            You have {data?.summary?.unassigned} unassigned routes.
          </CardDescription>
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              {isOpen ? "Hide" : "Show"} unassigned
              <CaretSortIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="py-4">
              {data?.unassigned.map((stop, index) => {
                const { name, address } = JSON.parse(stop.description ?? "{}");
                return (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                    onClick={() => {
                      setActiveLocationById(stop.id);
                      setIsStopSheetOpen(true);
                    }}
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-0.5 text-left">
                      <p className="text-sm font-medium capitalize leading-none">
                        {name}
                      </p>
                      <p className="text-xs font-medium leading-none">
                        {address}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
