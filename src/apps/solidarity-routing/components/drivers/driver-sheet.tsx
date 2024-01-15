import DriverForm from "~/apps/solidarity-routing/components/drivers/driver-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useDrivers } from "~/apps/solidarity-routing/hooks/use-drivers";

const DriverSheet = () => {
  const {
    activeDriver,
    setActiveDriver,
    isDriverSheetOpen,
    setIsDriverSheetOpen,
  } = useDrivers((state) => state);

  const handleOnOpenChange = (state: boolean) => {
    setActiveDriver(null);
    setIsDriverSheetOpen(state);
  };

  return (
    <Sheet open={isDriverSheetOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {activeDriver ? "Edit Driver" : "Add Driver"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Fill out the table below to start adding destinations to the map.
          </SheetDescription>
        </SheetHeader>

        <DriverForm handleOnOpenChange={handleOnOpenChange} />
      </SheetContent>
    </Sheet>
  );
};
export default DriverSheet;
