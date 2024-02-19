import { useState, type FC } from "react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import DriverForm from "~/apps/solidarity-routing/components/form-driver-vehicle/driver-form";

import {
  DriverDepotDataTable,
  DriverSheetDescription,
} from "~/apps/solidarity-routing/components/sheet-driver";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

type Props = { standalone?: boolean };

export const DriverVehicleSheet: FC<Props> = ({ standalone }) => {
  const { sessionStatus } = useSolidarityState();
  const driverBundles = useDriverVehicleBundles();

  const [selectedData, setSelectedData] = useState<DriverVehicleBundle[]>([]);
  const [tabValue, setTabValue] = useState<string>("depotDrivers");

  const title = driverBundles.active
    ? `${driverBundles.active.driver.name}`
    : "Manage Drivers";

  const areDepotOptionsVisible =
    driverBundles?.active === null &&
    sessionStatus === "authenticated" &&
    !standalone;

  const areStorageOptionsVisible =
    driverBundles?.active !== null ||
    sessionStatus === "unauthenticated" ||
    standalone;

  const assignVehiclesToRoute = () => {
    driverBundles.assign({
      drivers: selectedData,
    });
  };

  return (
    <Sheet
      open={driverBundles.isSheetOpen}
      onOpenChange={driverBundles.onSheetOpenChange}
    >
      <SheetContent
        side={"left"}
        className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
        onInteractOutside={(e) => e.preventDefault()}
      >
        <SheetHeader>
          <SheetTitle className="text-center text-xl md:text-left">
            {title}
          </SheetTitle>
          <DriverSheetDescription activeVehicle={driverBundles.active} />
        </SheetHeader>

        {/* Option 1: user is not logged in, can still add via session state */}

        {sessionStatus === "loading" && <p>Loading...</p>}

        {areDepotOptionsVisible && (
          <>
            <Tabs
              defaultValue="depotDrivers"
              className="w-full"
              value={tabValue}
              onValueChange={setTabValue}
            >
              <TabsList className="flex w-full items-center justify-between">
                <TabsTrigger value="depotDrivers" className="flex-1">
                  Add Existing
                </TabsTrigger>
                <TabsTrigger value="newDriver" className="flex-1">
                  Create New
                </TabsTrigger>
              </TabsList>

              <TabsContent value="depotDrivers">
                <Button
                  className="my-3 w-full p-4"
                  onClick={assignVehiclesToRoute}
                >
                  Update route drivers
                </Button>

                <DriverDepotDataTable
                  storeData={driverBundles.data}
                  data={driverBundles.depot}
                  setSelectedData={setSelectedData}
                />
              </TabsContent>
              <TabsContent value="newDriver">
                <DriverForm
                  handleOnOpenChange={driverBundles.onSheetOpenChange}
                  activeDriver={driverBundles.active}
                />
              </TabsContent>
            </Tabs>
          </>
        )}

        {/* Option 2: use is logged in and allows for user to select existing drivers
          as well as add new drivers to the database
        */}
        {areStorageOptionsVisible && (
          <DriverForm
            handleOnOpenChange={driverBundles.onSheetOpenChange}
            activeDriver={driverBundles.active}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
