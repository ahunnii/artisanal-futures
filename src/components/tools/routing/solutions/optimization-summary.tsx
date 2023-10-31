import { BellIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { useState, type ComponentProps } from "react";
import type { OptimizationData } from "~/components/tools/routing/types";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import {
  convertSecondsToMinutes,
  convertSecondsToMinutesAndHours,
} from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";

const notifications = [
  {
    title: "Your call has been confirmed.",
    description: "1 hour ago",
  },
  {
    title: "You have a new message!",
    description: "1 hour ago",
  },
  {
    title: "Your subscription is expiring soon!",
    description: "2 hours ago",
  },
];

interface CardProps extends ComponentProps<typeof Card> {
  data: OptimizationData;
}
export function OptimizationSummary({ data, className, ...props }: CardProps) {
  const [isOpen, setIsOpen] = useState(false);

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
              <p className="text-sm font-medium leading-none">
                {
                  convertSecondsToMinutesAndHours(data?.summary?.duration)
                    .formatted
                }
              </p>
              <p className="text-sm text-muted-foreground">Travel Time</p>
            </div>
          </div>{" "}
          <div className=" flex grow items-center rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {
                  convertSecondsToMinutesAndHours(data?.summary?.service)
                    .formatted
                }
              </p>
              <p className="text-sm text-muted-foreground">Service Time</p>
            </div>
          </div>{" "}
          <div className=" flex grow items-center rounded-md border p-4">
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                {convertMetersToMiles(data?.summary?.distance)}mi
              </p>
              <p className="text-sm text-muted-foreground">Distance Covered</p>
            </div>
          </div>{" "}
        </div>
        <Separator />
        <div>
          <CardTitle className=" text-lg">Unassigned</CardTitle>
          <CardDescription>
            You have {data?.summary?.unassigned} unassigned routes.
          </CardDescription>
        </div>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger>
            {" "}
            <Button variant="ghost" size="sm" className="gap-2">
              {isOpen ? "Hide" : "Show"} unassigned
              <CaretSortIcon className="h-4 w-4" />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="py-4">
              {data?.unassigned.map((notification, index) => {
                const { name, address } = JSON.parse(
                  notification.description ?? "{}"
                );
                return (
                  <div
                    key={index}
                    className="mb-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-0.5 text-left">
                      <p className="text-sm font-medium capitalize leading-none">
                        {name}
                      </p>{" "}
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
      {/* <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter> */}
    </Card>
  );
}
