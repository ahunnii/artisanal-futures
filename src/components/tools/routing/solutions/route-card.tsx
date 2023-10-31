import { BellIcon, CheckIcon } from "@radix-ui/react-icons";
import { uniqueId } from "lodash";
import { Truck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Switch } from "~/components/ui/switch";
import { useDrivers } from "~/hooks/routing/use-drivers";

import { Separator } from "~/components/ui/separator";
import {
  convertMetersToMiles,
  convertSecondsToTimeString,
} from "~/utils/routing/data-formatting";
import {
  convertSecondsToComponents,
  convertSecondsToTime,
} from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { RouteData } from "../types";
import RouteQRModal from "../ui/RouteQRModal";

interface CardProps extends React.ComponentProps<typeof Card> {
  data: RouteData;
}

export function RouteCard({ data, className, ...props }: CardProps) {
  const drivers = useDrivers((state) => state.drivers);
  console.log(data);

  const {
    name: driverName,
    address: startingAddress,
    contact_info: driverContact,
    description: driverDescription,
  } = JSON.parse(data.description ?? "{}");

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
                const { name, address, contact_info, description } = JSON.parse(
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

export function SimplifiedRouteCard({ data, className, ...props }: CardProps) {
  console.log(data);

  const {
    name: driverName,
    address: startingAddress,
    contact_info: driverContact,
    description: driverDescription,
  } = JSON.parse(data.description ?? "{}");

  return (
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
              {driverContact ?? "No contact provided"}
            </p>
          </div>
        </div>
        <Separator />
        <div>
          {data?.steps?.map((notification, index) => {
            const { name, address, contact_info, description } = JSON.parse(
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
                    {convertSecondsToTimeString(notification.arrival)}
                    {" -- "}
                    {notification.type === "start" && "Start of shift"}
                    {notification.type === "job" && "Fulfillment"}
                    {notification.type === "break" && "Break time "}{" "}
                    {notification.type === "end" && "End of shift"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {address ?? notification.description ?? ""}
                    {(notification.type === "start" ||
                      notification.type === "end") &&
                      startingAddress}
                    {notification.type === "break" && ""}{" "}
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
  );
}
