import { useSession } from "next-auth/react";
import { useState } from "react";

import { Users } from "lucide-react";

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

export const DriverAddSheet = ({ standalone }: { standalone?: boolean }) => {
  const drivers = useDriverVehicleBundles();

  const [selectedData, setSelectedData] = useState<DriverVehicleBundle[]>([]);
  const [tabValue, setTabValue] = useState<string>("account");

  const { status } = useSession();

  return (
    <Sheet open={drivers.isSheetOpen} onOpenChange={drivers.onSheetOpenChange}>
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
          <SheetTitle className="text-center md:text-left">
            {drivers.active ? "Edit Driver" : "Add Driver"}
          </SheetTitle>
          <SheetDescription className="text-center md:text-left">
            Fill out the table below to start adding destinations to the map.
          </SheetDescription>
        </SheetHeader>

        {/* Option 1: user is not logged in, can still add via session state */}

        {status === "loading" && <p>Loading...</p>}

        {drivers?.active === null &&
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
                          drivers.assign({
                            drivers: selectedData,
                          });
                        }}
                      >
                        Update route drivers
                      </Button>
                    </div>
                  </div>

                  <DriverDepotSelect
                    storeData={drivers.data}
                    data={drivers.depot}
                    setSelectedData={setSelectedData}
                  />
                </TabsContent>
                <TabsContent value="password">
                  <DriverForm
                    handleOnOpenChange={drivers.onSheetOpenChange}
                    activeDriver={drivers.active}
                  />
                </TabsContent>
              </Tabs>
            </>
          )}

        {/* Option 2: use is logged in and allows for user to select existing drivers
          as well as add new drivers to the database
        */}
        {(drivers?.active !== null ||
          status === "unauthenticated" ||
          standalone) && (
          <DriverForm
            handleOnOpenChange={drivers.onSheetOpenChange}
            activeDriver={drivers.active}
          />
        )}
      </SheetContent>
    </Sheet>
  );
};
