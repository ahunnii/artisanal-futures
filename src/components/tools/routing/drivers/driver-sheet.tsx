import { DriverForm } from "~/components/tools/routing/drivers/driver-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useDriverSheet } from "~/hooks/routing/use-driver-sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";

const DriverSheet = () => {
  const { isOpen, setIsOpen } = useDriverSheet();
  const { activeDriver, setActiveDriver } = useDrivers((state) => state);

  const handleOnOpenChange = (state: boolean) => {
    setActiveDriver(null);
    setIsOpen(state);
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
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
