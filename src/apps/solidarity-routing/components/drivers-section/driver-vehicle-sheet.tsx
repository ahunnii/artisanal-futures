import { useState, type FC } from "react";

import { Home, Mail, Phone, Users } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/map-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { DriverDepotDataTable } from "~/apps/solidarity-routing/components/drivers-section/driver-depot-data-table";
import DriverForm from "~/apps/solidarity-routing/components/drivers-section/driver-form";

import { numberStringToPhoneFormat } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";

type Props = {
  standalone?: boolean;
};
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
      {!standalone && (
        <SheetTrigger asChild>
          <Button variant="outline" className="px-3 shadow-none">
            <Users className="mr-2 h-4 w-4" />
            Manage Drivers
          </Button>
        </SheetTrigger>
      )}

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

interface IDriverSheetDescriptionProps {
  activeVehicle: DriverVehicleBundle | null;
}

const DriverSheetDescription = ({
  activeVehicle,
}: IDriverSheetDescriptionProps) => (
  <SheetDescription className="text-center md:text-left">
    {activeVehicle ? (
      <section className="flex w-full flex-1 flex-col border-b border-t py-4 text-sm">
        <p className="flex items-center gap-2 font-light text-muted-foreground ">
          <Home size={15} /> {activeVehicle.driver.address?.formatted}
        </p>
        <p className="flex items-center gap-2 font-light text-muted-foreground ">
          <Phone size={15} />{" "}
          {numberStringToPhoneFormat(activeVehicle.driver.phone)}
        </p>
        <p className="flex items-center gap-2 font-light text-muted-foreground ">
          <Mail size={15} /> {activeVehicle.driver.email}
        </p>
      </section>
    ) : (
      <p>Add drivers to your route plan from existing, or create a new one.</p>
    )}
  </SheetDescription>
);
