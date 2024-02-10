import { MessageSquare } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { MessagingBody } from "./messaging-body";

export const MessageSheet = () => {
  return (
    <Sheet>
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
            Messaging
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Ask questions about the route, or send updates about a stop to the
            depot.
          </SheetDescription>
        </SheetHeader>

        <MessagingBody />
      </SheetContent>
    </Sheet>
  );
};
