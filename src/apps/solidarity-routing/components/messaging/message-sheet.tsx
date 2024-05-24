import { zodResolver } from "@hookform/resolvers/zod";
import { Building, Send, User } from "lucide-react";
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
} from "~/components/ui/map-sheet";

import { useCallback, useEffect, useRef } from "react";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { useSolidarityMessaging } from "~/apps/solidarity-routing/hooks/use-solidarity-messaging";

import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { pusherClient } from "~/server/soketi/client";
import { api } from "~/utils/api";
import { useSolidarityNotifications } from "../../hooks/use-solidarity-notifications";
import { messageSchema } from "../../schemas.wip";
import { MessagingBody } from "./messaging-body";

type MessageFormValues = z.infer<typeof messageSchema>;

export const MessageSheet = () => {
  const solidarityMessaging = useSolidarityMessaging();
  const driverBundles = useDriverVehicleBundles();
  const bottomRef = useRef<HTMLDivElement>(null);
  const solidarityNotifications = useSolidarityNotifications();
  const apiContext = api.useContext();

  const checkIfMessagingIsValid =
    solidarityMessaging.messages?.length > 0 &&
    solidarityMessaging.memberId &&
    solidarityMessaging.isMessageSheetOpen;

  const form = useForm<MessageFormValues>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      message: "",
    },
  });

  const onSubmit = useCallback(
    (data: MessageFormValues) => {
      if (
        solidarityMessaging.memberId !== undefined &&
        solidarityMessaging.active?.id !== undefined
      ) {
        solidarityMessaging.createMessage({
          memberId: solidarityMessaging.memberId,
          channelId: solidarityMessaging.active?.id,
          message: data.message,
        });
        bottomRef?.current?.scrollIntoView({ behavior: "smooth" });
        form.reset();
      }
    },
    [solidarityMessaging, form]
  );

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
  }, [solidarityMessaging, form, onSubmit]);

  useEffect(() => {
    if (bottomRef.current && checkIfMessagingIsValid)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [solidarityMessaging, checkIfMessagingIsValid]);

  useEffect(() => {
    if (solidarityMessaging.isMessageSheetOpen) {
      solidarityNotifications.updateOtherMessageStatus({
        channelId: solidarityMessaging.active!.id,
        memberId: solidarityMessaging.memberId,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [solidarityMessaging.isMessageSheetOpen]);

  const messageThreadName = solidarityMessaging.isDepot
    ? `${driverBundles?.active?.driver?.name}`
    : "Depot";

  const channelName = solidarityMessaging.active?.name;

  return (
    <Sheet
      open={solidarityMessaging.isMessageSheetOpen}
      onOpenChange={solidarityMessaging.onMessageSheetOpenChange}
    >
      <SheetContent
        side={"right"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <h3>Message Thread with {messageThreadName}</h3>
          <SheetDescription>
            General messaging for {channelName}. Ask questions about the routes
            or provide updates.
          </SheetDescription>
        </SheetHeader>

        <ScrollArea className="flex-1 bg-slate-50 shadow-inner">
          {checkIfMessagingIsValid && (
            <>
              <MessagingBody
                messages={solidarityMessaging.messages ?? []}
                senderId={solidarityMessaging.memberId ?? ""}
                SenderIcon={solidarityMessaging.isDepot ? User : Building}
              />
              <div ref={bottomRef} />
            </>
          )}
        </ScrollArea>
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
