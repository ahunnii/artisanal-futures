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
import { getColor } from "~/utils/routing/color-handling";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import {
  convertSecondsToComponents,
  convertSecondsToTime,
  getCurrentDateFormatted,
} from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { RouteData, StepData } from "../types";
import RouteQRModal from "../ui/RouteQRModal";

interface CardProps extends React.ComponentProps<typeof Card> {
  data: RouteData;
  handleOnStopClick?: (stop: StepData | null) => void;
}

const FulfillmentLine = ({ step, idx }: { step: StepData; idx: number }) => {
  const { name, address } = JSON.parse(step.description ?? "{}");

  return (
    // <Button
    //   className="m-0  flex h-auto p-0 text-left"
    //   variant={"ghost"}
    //   // onClick={() => handleOnStopClick(step)}
    // >
    <div className="flex  ">
      <div className="relative col-start-2 col-end-4 mr-10 md:mx-auto">
        <div className="flex h-full w-6 items-center justify-center">
          <div className="pointer-events-none h-full w-1 bg-blue-400"></div>
        </div>
        <div className="absolute top-1/2 -mt-3 h-6 w-6 rounded-full bg-blue-400 text-center shadow">
          <i className="fas fa-check-circle font-bold text-white">{idx}</i>
        </div>
      </div>
      <div className="col-start-4 col-end-12 my-2 mr-auto flex w-full items-center  justify-between rounded-xl p-4">
        <div className="w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <h3 className="mb-1 text-base font-semibold text-slate-500">
              {name}
            </h3>
            <div className="flex basis-1/3 items-center justify-end font-semibold text-slate-500">
              {" "}
              {convertSecondsToTime(step.arrival)}
            </div>
          </div>
          <p className="w-full text-justify text-sm leading-tight text-slate-400">
            {address}
          </p>
        </div>
      </div>
    </div>
    // </Button>
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
          <h3 className="mb-1 text-base font-semibold text-slate-500">
            Break Time
          </h3>
          <p className="w-full text-justify text-sm leading-tight text-slate-400">
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
        <div className="w-full flex-col">
          <div className="flex w-full items-center justify-between">
            <h3 className="mb-1 text-base font-semibold text-slate-500">
              {step.type === "start" ? "Start from" : "End back at"}
            </h3>
            <div className="flex basis-1/3 items-center justify-end font-semibold text-slate-500">
              {" "}
              {convertSecondsToTime(step.arrival)}
            </div>
          </div>
          <p className="w-full text-justify text-sm leading-tight text-slate-400">
            {address}
          </p>
        </div>
      </div>
    </div>
  );
};

interface MinimalCardProps extends CardProps {
  textColor?: number;
}

export function MinimalRouteCard({
  data,
  handleOnStopClick,
  textColor,
  className,
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

  return (
    <Card className={cn("w-full", className)} {...props}>
      <Accordion type="single" collapsible>
        <AccordionItem value="item-1">
          <AccordionTrigger className="mt-3  pr-4 text-left">
            <CardHeader className="py-1">
              <CardTitle
                className="flex  flex-row items-center gap-4 text-base "
                onClick={() => console.log(data)}
              >
                <div
                  className={cn(
                    "flex basis-2/3 font-bold",
                    getColor(textColor!).text
                  )}
                >
                  {driverName}
                </div>
              </CardTitle>
              <CardDescription>
                {startTime} to {endTime} • {numberOfStops} stops •{" "}
                {convertMetersToMiles(data?.distance)} miles
              </CardDescription>{" "}
            </CardHeader>
          </AccordionTrigger>
          <AccordionContent className="">
            <CardContent className="grid gap-4">
              <ScrollArea className="my-4 h-80 w-full rounded-md border">
                <div className="w-full px-4 ">
                  {data?.steps?.map((notification, index) => {
                    return (
                      <div key={index} className="w-full">
                        {notification.type === "job" && (
                          <FulfillmentLine
                            step={notification}
                            idx={++jobIndex}
                            // handleOnStopClick={handleOnStopClick}
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
            <CardFooter>
              <Button
                className="w-full"
                onClick={() => console.log(data.geometry)}
              >
                <CheckIcon className="mr-2 h-4 w-4" /> Mark as complete and
                archive
              </Button>
            </CardFooter>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
