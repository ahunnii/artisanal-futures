import { zodResolver } from "@hookform/resolvers/zod";
import { MessageCircle, Send, User } from "lucide-react";
import { useEffect, useMemo, useRef, useState, type FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/components/ui/form";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { cn } from "~/utils/styles";

import Link from "next/link";
import toast from "react-hot-toast";
import { OptimizedRouteHeaderCard } from "~/apps/solidarity-routing/components/solutions/optimized-route-header-card";
import RouteBreakdown from "~/apps/solidarity-routing/components/solutions/route-breakdown";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import type {
  OptimizedRoutePath,
  OptimizedStop,
} from "~/apps/solidarity-routing/types.wip";
import { getColor } from "~/apps/solidarity-routing/utils/generic/color-handling";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";
import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { SheetDescription } from "~/components/ui/sheet";
import { driverVehicleBundleRouter } from "~/server/api/routers/routing/driver-vehicle-bundle";
import { pusherClient } from "~/server/soketi/client";
import { api } from "~/utils/api";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";
import { MessagingBody } from "../messaging/messaging-body";

type TInteractiveProps = {
  data: OptimizedRoutePath;
  textColor?: number;
  isOnline?: boolean;
  isTracking?: boolean;
} & React.ComponentProps<typeof Card>;

const InteractiveRouteCard: FC<TInteractiveProps> = ({
  data,
  className,
  ...props
}) => {
  const [onOpen, setOnOpen] = useState<boolean>(false);

  const driverBundles = useDriverVehicleBundles();

  const driver = driverBundles.getVehicleById(data.vehicleId);

  const color = useMemo(() => getColor(cuidToIndex(data.vehicleId)), [data]);

  return (
    <>
      <Sheet
        onOpenChange={driverBundles.onRouteSheetOpenChange}
        open={driverBundles.isRouteSheetOpen}
      >
        <SheetTrigger asChild>
          <Button
            variant={"ghost"}
            className="my-2 ml-auto  flex h-auto  w-full p-0 text-left"
            onClick={() => driverBundles.route(data.vehicleId)}
          >
            <Card
              className={cn("w-full hover:bg-slate-50", className)}
              {...props}
            >
              <OptimizedRouteHeaderCard
                route={data}
                textColor={color?.text ?? "text-black"}
                isButton={true}
                isOnline={false}
              />
            </Card>
          </Button>
        </SheetTrigger>
        <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
          <SheetHeader className="text-left">
            <OptimizedRouteHeaderCard
              route={data}
              textColor={color?.text ?? "text-black"}
              className="shadow-none"
            />
          </SheetHeader>
          <RouteBreakdown
            steps={data.stops as OptimizedStop[]}
            color={color.background}
            driver={driver}
          />
          <SheetFooter className="flex flex-row gap-2">
            <Button
              className="flex flex-1 gap-2"
              variant={"outline"}
              onClick={() => driverBundles.message(data.vehicleId)}
            >
              <MessageCircle /> Send Message to {driver?.driver?.name}
            </Button>
            <Link
              href={`/tools/solidarity-pathways/1/route/${data.routeId}/path/${data.id}`}
            >
              <Button className="">View Route</Button>
            </Link>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default InteractiveRouteCard;
const messageSchema = z.object({
  message: z.string(),
});
export const MessagingSheet = () => {
  const { depotId, driverId } = useSolidarityState();
  const driverBundles = useDriverVehicleBundles();
  const driver = driverBundles.getVehicleById(driverId);

  const apiContext = api.useContext();

  const bottomRef = useRef<HTMLDivElement>(null);
  const { data: depotChannel } =
    api.routeMessaging.getDepotDriverChannel.useQuery(
      {
        depotId,
        driverId: driver?.driver?.id ?? "",
      },
      {
        enabled:
          driver?.driver?.id !== undefined && driverBundles.isMessageSheetOpen,
      }
    );

  const { data: membership } = api.routeMessaging.getMember.useQuery(
    {
      depotId,
    },
    {
      enabled: driverBundles.isMessageSheetOpen,
    }
  );

  const { mutate: createMessage } =
    api.routeMessaging.sendDriverChannelMessage.useMutation({
      onSuccess: () => {
        toast.success("Message sent");
      },
      onError: (e) => {
        toast.error("There was an issue sending your message");
        console.log(e);
      },
      onSettled: () => {
        void apiContext.routeMessaging.invalidate();
      },
    });

  useEffect(() => {
    // 👇️ scroll to bottom every time messages change
    if (
      bottomRef.current &&
      depotChannel?.messages &&
      membership &&
      driverBundles.isMessageSheetOpen
    )
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [depotChannel?.messages, membership, driverBundles.isMessageSheetOpen]);

  const onSubmit = (data: MessageFormValues) => {
    if (membership?.id !== undefined && depotChannel?.id !== undefined) {
      createMessage({
        memberId: membership?.id,
        channelId: depotChannel?.id,
        message: data.message,
      });
      bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  type MessageFormValues = z.infer<typeof messageSchema>;

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  useEffect(() => {
    pusherClient.subscribe("map");

    pusherClient.bind("evt::invalidate-messages", () => {
      void apiContext.routeMessaging.invalidate();
    });

    return () => {
      pusherClient.unsubscribe("map");
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {/* <Button
        className="flex flex-1 gap-2"
        variant={"outline"}
        onClick={() => driverBundles.message(driverId)}
      >
        <MessageCircle /> Send Message to {driver?.driver?.name}
      </Button> */}
      <Sheet
        open={driverBundles.isMessageSheetOpen}
        onOpenChange={driverBundles.onMessageSheetOpenChange}
      >
        {/* <SheetTrigger asChild>
      
      </SheetTrigger> */}
        <SheetContent className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg">
          <SheetHeader>
            <h3>Message Thread with {driver?.driver?.name}</h3>
            <SheetDescription>
              {" "}
              General Messaging for Depot {depotChannel?.id} -{" "}
              {depotChannel?.name}
            </SheetDescription>
          </SheetHeader>

          {driverBundles.isMessageSheetOpen &&
            depotChannel?.messages &&
            depotChannel?.messages?.length > 0 &&
            membership && (
              <ScrollArea>
                <MessagingBody
                  messages={depotChannel?.messages ?? []}
                  senderId={membership?.id}
                  SenderIcon={User}
                />
                <div ref={bottomRef} />
              </ScrollArea>
            )}
          {!depotChannel?.messages ||
            (depotChannel?.messages?.length === 0 && (
              <ScrollArea className="flex-1 bg-slate-50 shadow-inner"></ScrollArea>
            ))}

          <Form {...form}>
            <div className="flex-shrink-0">
              <form
                onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
                className="flex items-center gap-2 px-4"
              >
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormControl>
                        <AutoResizeTextArea
                          className=""
                          placeholder="Type a message"
                          maxHeight={100}
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />{" "}
                <Button
                  aria-label="Send"
                  className="ml-auto"
                  type="submit"
                  size="icon"
                  variant={"ghost"}
                >
                  <Send className="h-5 w-5" />
                  <span className="sr-only">Send</span>
                </Button>
              </form>
            </div>
          </Form>
        </SheetContent>
      </Sheet>
    </>
  );
};
