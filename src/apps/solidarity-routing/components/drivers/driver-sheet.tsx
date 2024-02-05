import DriverForm from "~/apps/solidarity-routing/components/drivers/driver-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";

const DriverSheet = () => {
  const { drivers } = useDriverVehicleBundles();

  const handleOnOpenChange = (state: boolean) => {
    if (!state) drivers.setActiveById(null);
    drivers.setDriverSheetState(state);
  };

  return (
    <Sheet open={drivers.isDriverSheetOpen} onOpenChange={handleOnOpenChange}>
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
      >
        <SheetHeader>
          <SheetTitle className="text-center md:text-left">
            {drivers.currentDriver
              ? `${drivers?.currentDriver?.driver?.name}`
              : "Add Driver"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            {drivers.currentDriver
              ? `Changes made will only apply to this route.`
              : "Fill out the table below to start adding destinations to the map."}
          </SheetDescription>
        </SheetHeader>

        <DriverForm
          handleOnOpenChange={handleOnOpenChange}
          activeDriver={drivers.currentDriver}
        />
      </SheetContent>
    </Sheet>
  );
};
export default DriverSheet;
