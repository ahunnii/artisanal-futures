import { zodResolver } from "@hookform/resolvers/zod";
import { Building, MessageSquare, Send } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
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
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { ScrollArea } from "~/components/ui/scroll-area";
import { pusherClient } from "~/server/soketi/client";
import { api } from "~/utils/api";
import { useOptimizedRoutePlan } from "../../hooks/optimized-data/use-optimized-route-plan";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";
import { MessagingBody } from "./messaging-body";

const messageSchema = z.object({
  message: z.string(),
});

export const MessageSheet = () => {
  const [open, setOpen] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const { depotId } = useSolidarityState();
  const apiContext = api.useContext();
  const optimizedRoute = useOptimizedRoutePlan();
  const { data: depotChannel } =
    api.routeMessaging.getDepotDriverChannel.useQuery(
      {
        depotId,
        driverId: optimizedRoute?.currentDriver!.driver.id,
      },
      {
        enabled:
          optimizedRoute?.currentDriver?.driver?.id !== undefined && open,
      }
    );

  const { data: membership } = api.routeMessaging.getMember.useQuery(
    {
      depotId,
      driverId: optimizedRoute?.currentDriver?.driver?.id,
    },
    {
      enabled: optimizedRoute?.currentDriver?.driver?.id !== undefined && open,
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
    // 👇️ scroll to bottom every time messages change
    if (bottomRef.current && depotChannel?.messages && membership && open)
      bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [depotChannel?.messages, membership, open]);

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
        toast.success(form.getValues().message);
        onSubmit(form.getValues());
        form.reset();
        // setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button variant="outline" className="px-3 shadow-none">
          <MessageSquare className="mr-2 h-4 w-4" />
          Open Messaging
        </Button>
      </SheetTrigger>

      <SheetContent
        side={"right"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl md:text-left">
            General Messaging for Depot {depotChannel?.id} -{" "}
            {depotChannel?.name}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Ask questions about the route, or send updates about a stop to the
            depot.
          </SheetDescription>
        </SheetHeader>

        {open && depotChannel?.messages && membership && (
          <ScrollArea>
            <MessagingBody
              messages={depotChannel?.messages ?? []}
              senderId={membership?.id}
              SenderIcon={Building}
            />
            <div ref={bottomRef} />
          </ScrollArea>
        )}

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
