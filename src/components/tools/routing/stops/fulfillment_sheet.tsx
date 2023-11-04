import { type FC } from "react";

import { useSheet } from "~/hooks/routing/use-sheet";

import type { Stop } from "../types";
import { StopForm } from "./stop_form";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";
import { useStops } from "~/hooks/routing/use-stops";

interface IProps {
  stop?: Stop | null;
}
const FulfillmentSheet: FC<IProps> = () => {
  const { isOpen, onClose, setIsOpen } = useSheet();
  const { activeLocation } = useStops((state) => state);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent
        side={"left"}
        className="flex w-full max-w-full flex-col  sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {" "}
            {activeLocation ? "Edit Stop" : "Add Stop"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Fill out the table below to start adding destinations to the map.
          </SheetDescription>
        </SheetHeader>

        <StopForm callback={onClose} />
      </SheetContent>
    </Sheet>
  );
};

export default FulfillmentSheet;
