import { useSession } from "next-auth/react";
import { useState } from "react";

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

import { DriverDepotSelect } from "~/apps/solidarity-routing/components/drivers/driver-depot-select";
import DriverForm from "~/apps/solidarity-routing/components/drivers/driver-form";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { numberStringToPhoneFormat } from "../../utils/generic/format-utils.wip";

export const DriverAddSheet = ({ standalone }: { standalone?: boolean }) => {
  const driverBundles = useDriverVehicleBundles();

  const [selectedData, setSelectedData] = useState<DriverVehicleBundle[]>([]);
  const [tabValue, setTabValue] = useState<string>("account");

  const { status } = useSession();

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
            {driverBundles.active
              ? `${driverBundles.active.driver.name}`
              : "Add Driver"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            {driverBundles.active ? (
              <>
                <div className="flex w-full flex-1 flex-col border-b border-t py-4 text-sm">
                  {/* <p className="flex items-center gap-2 text-black ">
                    <User size={15} /> {drivers.active.driver.name}
                  </p> */}
                  <p className="flex items-center gap-2 font-light text-muted-foreground ">
                    <Home size={15} />{" "}
                    {driverBundles.active.driver.address?.formatted}
                  </p>
                  <p className="flex items-center gap-2 font-light text-muted-foreground ">
                    <Phone size={15} />{" "}
                    {numberStringToPhoneFormat(
                      driverBundles.active.driver.phone
                    )}
                  </p>
                  <p className="flex items-center gap-2 font-light text-muted-foreground ">
                    <Mail size={15} /> {driverBundles.active.driver.email}
                  </p>
                </div>
              </>
            ) : (
              "Fill out the table below to start adding destinations to the map."
            )}
          </SheetDescription>
        </SheetHeader>

        {/* Option 1: user is not logged in, can still add via session state */}

        {status === "loading" && <p>Loading...</p>}

        {driverBundles?.active === null &&
          status === "authenticated" &&
          !standalone && (
            <>
              <Tabs
                defaultValue="account"
                className="w-full"
                value={tabValue}
                onValueChange={setTabValue}
              >
                <div className="flex w-full items-center justify-between">
                  <TabsList>
                    <TabsTrigger value="account">Add Existing</TabsTrigger>
                    <TabsTrigger value="password">Create New</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="account">
                  <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
                    <div className="flex items-center justify-between gap-3">
                      <Button
                        className="flex-1"
                        onClick={() => {
                          driverBundles.assign({
                            drivers: selectedData,
                          });
                        }}
                      >
                        Update route drivers
                      </Button>
                    </div>
                  </div>

                  <DriverDepotSelect
                    storeData={driverBundles.data}
                    data={driverBundles.depot}
                    setSelectedData={setSelectedData}
                  />
                </TabsContent>
                <TabsContent value="password">
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
        {(driverBundles?.active !== null ||
          status === "unauthenticated" ||
          standalone) && (
          <DriverForm
            handleOnOpenChange={driverBundles.onSheetOpenChange}
            activeDriver={driverBundles.active}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
