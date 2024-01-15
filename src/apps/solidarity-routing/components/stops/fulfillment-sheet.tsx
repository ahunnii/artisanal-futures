import StopForm from "~/apps/solidarity-routing/components/stops/stop-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";

const StopSheet = () => {
  const {
    activeLocation,
    setActiveLocation,
    isStopSheetOpen,
    setIsStopSheetOpen,
  } = useStops((state) => state);

  const handleOnOpenChange = (state: boolean) => {
    setActiveLocation(null);
    setIsStopSheetOpen(state);
  };

  return (
    <Sheet open={isStopSheetOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
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
      </SheetContent>
    </Sheet>
  );
};

export default StopSheet;
