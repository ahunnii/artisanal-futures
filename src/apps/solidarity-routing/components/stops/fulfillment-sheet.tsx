import StopForm from "~/apps/solidarity-routing/components/stops/stop-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

const StopSheet = () => {
  const { activeStop, setActiveStopById, isStopSheetOpen, setStopSheetState } =
    useClientJobBundles();

  const handleOnOpenChange = (state: boolean) => {
    if (!state) setActiveStopById(null);
    setStopSheetState(state);
  };

  return (
    <Sheet open={isStopSheetOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {activeStop
              ? `${
                  activeStop?.client?.name ??
                  activeStop?.job?.address?.formatted
                }`
              : "Add Stop"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            {activeStop
              ? `Changes made will only apply to this route.`
              : "Fill out the table below to start adding destinations to the map."}
          </SheetDescription>
        </SheetHeader>

        <StopForm handleOnOpenChange={handleOnOpenChange} />
      </SheetContent>
    </Sheet>
  );
};

export default StopSheet;
