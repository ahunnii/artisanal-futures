import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Input } from "~/components/ui/input";

import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";
import { ScrollArea } from "~/components/ui/scroll-area";

type DriverDispatchMessagingProps = {
  recipient: string;
  route: ExpandedRouteData;
};

const MESSAGE_DEMO = [
  {
    routeId: "clqdbf6hu0004b5d9p39oqbq7",
    role: "driver",
    message: "Hey, I'm running late",
  },

  {
    routeId: "clqdbf6hu0004b5d9p39oqbq7",
    role: "dispatch",
    message: "That is fine.",
  },
  {
    routeId: "clqdbf6hu0004b5d9p39oqbq7",
    role: "dispatch",
    message: "Just make sure to let the customer know",
  },
  {
    routeId: "clqdbf6hu0004b5d9p39oqbq7",
    role: "driver",
    message: "Ok, will do :D",
  },
];
export function DriverDispatchMessaging({
  recipient,
  route,
}: DriverDispatchMessagingProps) {
  const { name: driverName } = JSON.parse(route.description ?? "{}");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="z-50">
          Message {recipient === "driver" ? driverName : "Dispatch"}{" "}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            Message {recipient === "driver" ? driverName : "Dispatch"}{" "}
          </DialogTitle>
          <DialogDescription>
            Contact {recipient} about route #{route.routeId}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <ScrollArea className="h-96 border border-slate-300 shadow-inner">
            <div className="w-full space-y-4 p-4">
              {MESSAGE_DEMO.map((message, index) => {
                return (
                  <div className="flex flex-col space-y-2 " key={index}>
                    {/* {message.role === "driver" ? (
                      <SenderMessageBubble message={message.message} />
                    ) : (
                      <RecipientMessageBubble message={message.message} />
                    )} */}

                    {recipient.toLowerCase() === message.role.toLowerCase() ? (
                      <RecipientMessageBubble message={message.message} />
                    ) : (
                      <SenderMessageBubble message={message.message} />
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
          <div className="grid grid-cols-4 items-center gap-4">
            <Input
              id="name"
              defaultValue="Pedro Duarte"
              className="col-span-3"
            />{" "}
            <Button type="button">Send</Button>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const SenderMessageBubble = ({ message }: { message: string }) => {
  return (
    <div className="ml-auto w-3/4    rounded bg-blue-500 p-2 text-white">
      {message}
    </div>
  );
};

const RecipientMessageBubble = ({ message }: { message: string }) => {
  return (
    <div className="w-3/4 rounded bg-slate-500 p-2 text-white">{message}</div>
  );
};
