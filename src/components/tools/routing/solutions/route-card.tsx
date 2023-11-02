import { CheckIcon } from "@radix-ui/react-icons";
import { uniqueId } from "lodash";
import { Coffee, Home, Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Avatar, AvatarFallback } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { ScrollArea } from "~/components/ui/scroll-area";

import { useDrivers } from "~/hooks/routing/use-drivers";

import { Separator } from "~/components/ui/separator";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import {
  convertSecondsToComponents,
  convertSecondsToTime,
} from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { RouteData, StepData } from "../types";
import RouteQRModal from "../ui/RouteQRModal";

interface CardProps extends React.ComponentProps<typeof Card> {
  data: RouteData;
  handleOnStopClick?: (stop: StepData | null) => void;
  handleOnMessage?: ({
    deliveryNotes,
    address,
    status,
  }: {
    deliveryNotes: string;
    address: string;
    status: string;
  }) => void;
}

export function RouteCard({ data, className, ...props }: CardProps) {
  const drivers = useDrivers((state) => state.drivers);
  console.log(data);

  const { name: driverName, address: startingAddress } = JSON.parse(
    data.description ?? "{}"
  );

  return (
    <AccordionItem value={`item-${uniqueId()}`}>
      <AccordionTrigger>{driverName ?? "Driver"}</AccordionTrigger>
      <AccordionContent>
        <Card className={cn("w-full", className)} {...props}>
          <CardHeader>
            <CardTitle>Stats</CardTitle>
            <CardDescription>22mi</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="flex items-center">
              <Avatar className="flex h-9 w-9 items-center justify-center space-y-0 border">
                {/* <AvatarImage src="/avatars/02.png" alt="Avatar" /> */}
                <AvatarFallback>
                  <Truck />
                </AvatarFallback>
              </Avatar>
              <div className="ml-4 space-y-1">
                <p className="text-sm font-medium leading-none">
                  {driverName ?? "Driver"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {/* {driverContact ?? "No contact provided"} */}
                  Prep time for Route:{" "}
                  {data?.setup === 0
                    ? "0 min"
                    : convertSecondsToComponents(data?.setup).formatted}
                </p>{" "}
                <p className="text-sm text-muted-foreground">
                  Fulfillment time for Route:{" "}
                  {convertSecondsToComponents(data?.service).formatted}
                </p>{" "}
                <p className="text-sm text-muted-foreground">
                  Travel time for Route:{" "}
                  {convertSecondsToComponents(data?.duration).formatted}
                </p>{" "}
                <p className="text-sm text-muted-foreground">
                  Waiting time for Route:{" "}
                  {convertSecondsToComponents(data?.waiting_time).formatted}
                </p>{" "}
                <p className="text-sm text-muted-foreground">
                  Estimated distance covered:{" "}
                  {convertMetersToMiles(data?.distance)} miles
                </p>
              </div>
              <div className="ml-auto font-medium">
                <RouteQRModal data={data} />
              </div>
            </div>
            <Separator />

            <div>
              {data?.steps?.map((notification, index) => {
                const { address } = JSON.parse(
                  notification.description ?? "{}"
                );

                return (
                  <div
                    key={index}
                    className="mb-4 mt-4 grid grid-cols-[25px_1fr] items-start pb-4 last:mb-0 last:pb-0"
                  >
                    <span className="flex h-2 w-2 translate-y-1 rounded-full bg-sky-500" />
                    <div className="space-y-0.5 text-left">
                      <p className="text-sm font-medium leading-none">
                        {convertSecondsToTime(notification.arrival)}
                        {" -- "}
                        {notification.type === "start" && "Start of shift"}
                        {notification.type === "job" && "Fulfillment"}
                        {notification.type === "break" && "Break time "}{" "}
                        {notification.type === "end" && "End of shift"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {address ?? notification.description ?? ""}
                        {((notification.type === "start" ||
                          notification.type === "end") &&
                          startingAddress) ??
                          drivers.find((driver) => driver.id === data?.vehicle)
                            ?.address}
                        {notification.type === "break" && ""}{" "}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        Info: Arrival at{" "}
                        {convertSecondsToTime(notification?.arrival)}
                        -- Total travel time for this step:
                        {
                          convertSecondsToComponents(notification?.duration)
                            .formatted
                        }{" "}
                        -- Prep time for this step:{" "}
                        {
                          convertSecondsToComponents(notification?.setup)
                            .formatted
                        }
                        -- Service time for this step:{" "}
                        {
                          convertSecondsToComponents(notification?.service)
                            .formatted
                        }
                        -- waiting_time for this step:{" "}
                        {
                          convertSecondsToComponents(notification?.waiting_time)
                            .formatted
                        }
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">
              <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
            </Button>
          </CardFooter>
        </Card>
      </AccordionContent>
    </AccordionItem>
  );
}
function getCurrentDateFormatted(): string {
  // Create a new Date object for the current date and time
  const currentDate = new Date();

  // Array of days and months to get names instead of numbers
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day of the week, month, and the date
  const day = days[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const date = currentDate.getDate();

  // Return the formatted string
  return `${day}, ${month} ${date}`;
}

export function SimplifiedRouteCard({
  data,
  handleOnStopClick,

  className,
  ...props
}: CardProps) {
  const { name: driverName, address: startingAddress } = JSON.parse(
    data.description ?? "{}"
  );

  const date = getCurrentDateFormatted();
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
  return (
    <Card className={cn("w-full", className)} {...props}>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="pr-4 text-left">
            {" "}
            <CardHeader>
              <CardDescription>
                Start {startTime} • End {endTime} • {numberOfStops} stops •{" "}
                {convertMetersToMiles(data?.distance)} miles
              </CardDescription>{" "}
              <CardTitle>{date}</CardTitle>{" "}
              <CardTitle className="text-lg font-normal">
                {driverName}
              </CardTitle>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="grid gap-4">
              <ScrollArea className="h-96 w-full rounded-md border">
                <div className="w-full p-4">
                  {data?.steps?.map((notification, index) => {
                    return (
                      <div key={index} className="w-full">
                        {notification.type === "job" && handleOnStopClick && (
                          <FulfillmentLine
                            step={notification}
                            idx={++jobIndex}
                            handleOnStopClick={handleOnStopClick}
                          />
                        )}
                        {(notification.type === "start" ||
                          notification.type === "end") && (
                          <HomeLine
                            step={notification}
                            address={startingAddress ?? ""}
                          />
                        )}
                        {notification.type === "break" && (
                          <BreakLine step={notification} />
                        )}{" "}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter> */}
    </Card>
  );
}

const FulfillmentLine = ({
  step,
  idx,
  handleOnStopClick,
}: {
  step: StepData;
  idx: number;
  handleOnStopClick: (stop: StepData | null) => void;
}) => {
  const { name, address } = JSON.parse(step.description ?? "{}");

  return (
    <Button
      className="m-0  flex h-auto p-0 text-left"
      variant={"ghost"}
      onClick={() => handleOnStopClick(step)}
    >
      <div className="flex  ">
        <div className="relative col-start-2 col-end-4 mr-10 md:mx-auto">
          <div className="flex h-full w-6 items-center justify-center">
            <div className="pointer-events-none h-full w-1 bg-blue-400"></div>
          </div>
          <div className="absolute top-1/2 -mt-3 h-6 w-6 rounded-full bg-blue-400 text-center shadow">
            <i className="fas fa-check-circle font-bold text-white"> {idx}</i>
          </div>
        </div>
        <div className=" col-start-4 col-end-12 my-2 mr-auto flex w-full items-center justify-between  rounded-xl p-4 ">
          <div className="basis-2/3 flex-col">
            <h3 className="mb-1 text-lg font-semibold text-slate-500">
              {name}
            </h3>
            <p className="w-full text-justify leading-tight text-slate-400">
              {address}
            </p>
          </div>

          <div className="flex basis-1/3 items-center justify-end font-semibold text-slate-500">
            {" "}
            {convertSecondsToTime(step.arrival)}
          </div>
        </div>
      </div>
    </Button>
  );
};

const BreakLine = ({ step }: { step: StepData }) => {
  return (
    <div className="flex ">
      <div className="relative col-start-2 col-end-4 mr-10 md:mx-auto">
        <div className="flex h-full w-6 items-center justify-center">
          <div className="pointer-events-none h-full w-1 bg-blue-400"></div>
        </div>
        <div className="absolute top-1/2 -mt-3 h-6 w-6 rounded-full bg-blue-400 text-center shadow">
          <i className="fas fa-times-circle text-white">
            <Coffee className="p-1" />
          </i>
        </div>
      </div>

      <div className="my-2 mr-auto flex w-full items-center justify-between rounded-xl p-4  ">
        <div className="basis-2/3 flex-col">
          <h3 className="mb-1 text-lg font-semibold text-slate-500">
            Break Time
          </h3>
          <p className="w-full text-justify leading-tight text-slate-400">
            Duration is {convertSecondsToComponents(step?.service).formatted}
          </p>
        </div>

        <div className="col-start-4 col-end-11 flex basis-1/3 items-center justify-end font-semibold text-slate-500">
          {" "}
          {convertSecondsToTime(step.arrival)}
        </div>
      </div>
    </div>
  );
};

const HomeLine = ({ step, address }: { step: StepData; address: string }) => {
  return (
    <div className="flex ">
      <div className="relative col-start-2 col-end-4 mr-10 md:mx-auto">
        <div className="flex h-full w-6 items-center justify-center">
          <div className="pointer-events-none h-full w-1 bg-blue-400"></div>
        </div>
        <div className="absolute top-1/2 -mt-3 h-6 w-6 rounded-full bg-blue-400 text-center shadow">
          <i className="fas fa-exclamation-circle text-xs text-white">
            <Home className="p-1" />
          </i>
        </div>
      </div>
      <div className="col-start-4 col-end-12 my-2 mr-auto flex w-full items-center  justify-between rounded-xl p-4">
        <div className="basis-2/3 flex-col">
          <h3 className="mb-1 text-lg font-semibold text-slate-500">
            {step.type === "start" ? "Start from" : "End back at"}
          </h3>
          <p className="w-full text-justify leading-tight text-slate-400">
            {address}
          </p>
        </div>

        <div className="flex basis-1/3 items-center justify-end font-semibold text-slate-500">
          {" "}
          {convertSecondsToTime(step.arrival)}
        </div>
      </div>
    </div>
  );
};

export function MinimalRouteCard({
  data,
  handleOnStopClick,
  className,
  ...props
}: CardProps) {
  const { name: driverName, address: startingAddress } = JSON.parse(
    data.description ?? "{}"
  );

  const date = getCurrentDateFormatted();
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
  return (
    <Card className={cn("w-full", className)} {...props}>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="pr-4 text-left">
            {" "}
            <CardHeader>
              <CardDescription>
                Start {startTime} • End {endTime} • {numberOfStops} stops •{" "}
                {convertMetersToMiles(data?.distance)} miles
              </CardDescription>{" "}
              <CardTitle>{date}</CardTitle>{" "}
              <CardTitle className="text-lg font-normal">
                {driverName}
              </CardTitle>
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent>
            <CardContent className="grid gap-4">
              <ScrollArea className="h-96 w-full rounded-md border">
                <div className="w-full p-4">
                  {data?.steps?.map((notification, index) => {
                    return (
                      <div key={index} className="w-full">
                        {notification.type === "job" && handleOnStopClick && (
                          <FulfillmentLine
                            step={notification}
                            idx={++jobIndex}
                            handleOnStopClick={handleOnStopClick}
                          />
                        )}
                        {(notification.type === "start" ||
                          notification.type === "end") && (
                          <HomeLine
                            step={notification}
                            address={startingAddress ?? ""}
                          />
                        )}
                        {notification.type === "break" && (
                          <BreakLine step={notification} />
                        )}{" "}
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* <CardFooter>
        <Button className="w-full">
          <CheckIcon className="mr-2 h-4 w-4" /> Mark all as read
        </Button>
      </CardFooter> */}
    </Card>
  );
}
