import { StopForm } from "~/components/tools/routing/stops/stop-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useSheet } from "~/hooks/routing/use-sheet";
import { useStops } from "~/hooks/routing/use-stops";

const FulfillmentSheet = () => {
  const { isOpen, setIsOpen } = useSheet();
  const { activeLocation, setActiveLocation } = useStops((state) => state);

  const handleOnOpenChange = (state: boolean) => {
    setActiveLocation(null);
    setIsOpen(state);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col bg-orange-500 sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {activeLocation ? "Edit Stop" : "Add Stop"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Fill out the table below to start adding destinations to the map.
          </SheetDescription>
        </SheetHeader>

        <StopForm handleOnOpenChange={handleOnOpenChange} />
        <p>Test</p>
      </SheetContent>
    </Sheet>
  );
};

export default FulfillmentSheet;
