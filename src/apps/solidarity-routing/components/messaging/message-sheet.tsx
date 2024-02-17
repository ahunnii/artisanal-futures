import { zodResolver } from "@hookform/resolvers/zod";
import { Send, User } from "lucide-react";
import { useForm } from "react-hook-form";
import type * as z from "zod";
import { Button } from "~/components/ui/button";
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
  SheetDescription,
  SheetHeader,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { useEffect, useRef, type ReactNode } from "react";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { useSolidarityMessaging } from "~/apps/solidarity-routing/hooks/use-solidarity-messaging";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { pusherClient } from "~/server/soketi/client";
import { api } from "~/utils/api";
import { messageSchema } from "../../schemas.wip";
import { MessagingBody } from "./messaging-body";

type Props = {
  currentDriver: DriverVehicleBundle | null;
  isDepot: boolean;
  children: ReactNode;
};

type MessageFormValues = z.infer<typeof messageSchema>;

export const MessageSheet = ({ currentDriver, isDepot, children }: Props) => {
  const { driverChannel, membership, createMessage } = useSolidarityMessaging({
    currentDriver: currentDriver,
    isDepot: isDepot,
  });
  const bottomRef = useRef<HTMLDivElement>(null);

  const apiContext = api.useContext();
  const driverBundles = useDriverVehicleBundles();

  useEffect(() => {
    if (
      bottomRef.current &&
      driverChannel?.messages &&
      membership &&
      driverBundles.isMessageSheetOpen
    )
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [driverChannel?.messages, membership, driverBundles.isMessageSheetOpen]);

  const onSubmit = (data: MessageFormValues) => {
    if (membership?.id !== undefined && driverChannel?.id !== undefined) {
      createMessage({
        memberId: membership?.id,
        channelId: driverChannel?.id,
        message: data.message,
      });
      bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
      form.reset();
    }
  };

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

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "Enter" && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        onSubmit(form.getValues());
      }
    };
    if (form) document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [membership?.id, driverChannel?.id]);

  return (
    <Sheet
      open={driverBundles.isMessageSheetOpen}
      onOpenChange={driverBundles.onMessageSheetOpenChange}
    >
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent
        side={"right"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <h3>
            Message Thread with{" "}
            {isDepot ? currentDriver?.driver?.name : "Depot"}
          </h3>
          <SheetDescription>
            General messaging for {driverChannel?.name}. Ask questions about the
            routes or provide updates.
          </SheetDescription>
        </SheetHeader>
        {driverBundles.isMessageSheetOpen &&
          driverChannel?.messages &&
          driverChannel?.messages?.length > 0 &&
          membership && (
            <ScrollArea>
              <MessagingBody
                messages={driverChannel?.messages ?? []}
                senderId={membership?.id}
                SenderIcon={User}
              />
              <div ref={bottomRef} />
            </ScrollArea>
          )}
        {!driverChannel?.messages ||
          (driverChannel?.messages?.length === 0 && (
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
  );
};
