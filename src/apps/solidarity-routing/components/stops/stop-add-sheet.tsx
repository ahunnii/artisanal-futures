import { AnimatePresence, motion } from "framer-motion";
import DriverForm from "~/apps/solidarity-routing/components/drivers/driver-form";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/map-sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import { MapPin, Plus, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";
import { useState } from "react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";

import { DriverVehicleBundle } from "../../types.wip";
import { DriverDepotSelect } from "./client-job-select";

export const StopAddSheet = () => {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [selectedData, setSelectedData] = useState<DriverVehicleBundle[]>([]);
  const [tabValue, setTabValue] = useState<string>("account");
  // const { drivers } = useDriverVehicleBundles();
  const { status } = useSession();

  // const handleOnOpenChange = (state: boolean) => {
  //   if (!state) drivers.setActiveById(null);
  //   drivers.setDriverSheetState(state);
  // };

  return (
    <Button>WIP</Button>
    // <Sheet open={open} onOpenChange={setOpen}>
    //   <SheetTrigger asChild>
    //     <Button
    //       variant="outline"
    //       className="rounded-r-none border-0 px-3 shadow-none"
    //     >
    //       <Plus className="mr-2 h-4 w-4" />
    //       Add Stop
    //     </Button>
    //   </SheetTrigger>
    //   <SheetContent
    //     side={"left"}
    //     className="radix-dialog-content flex w-full  max-w-full flex-col sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg "
    //     onInteractOutside={(e) => e.preventDefault()}
    //   >
    //     <SheetHeader>
    //       <SheetTitle className="text-center md:text-left">
    //         {drivers.currentDriver ? "Edit Driver" : "Add Driver"}
    //       </SheetTitle>
    //       <SheetDescription className="text-center md:text-left">
    //         Fill out the table below to start adding destinations to the map.
    //       </SheetDescription>
    //     </SheetHeader>

    //     {/* Option 1: user is not logged in, can still add via session state */}

    //     {status === "loading" && <p>Loading...</p>}

    //     {status === "authenticated" && (
    //       <>
    //         <Tabs
    //           defaultValue="account"
    //           className="w-full"
    //           value={tabValue}
    //           onValueChange={setTabValue}
    //         >
    //           <div className="flex w-full items-center justify-between">
    //             <TabsList>
    //               <TabsTrigger value="account">Add Existing</TabsTrigger>
    //               <TabsTrigger value="password">Create New</TabsTrigger>
    //             </TabsList>

    //             <Button
    //               size={"sm"}
    //               onClick={() => {
    //                 drivers.setDrivers({
    //                   drivers: selectedData,
    //                   saveToDB: false,
    //                 });
    //                 setOpen(false);
    //                 toast.success("Drivers added to route!");
    //               }}
    //             >
    //               Save and Close
    //             </Button>
    //           </div>
    //           <TabsContent value="account">
    //             <DriverDepotSelect
    //               storeData={drivers?.all ?? []}
    //               data={drivers?.stored ?? []}
    //               setSelectedData={setSelectedData}
    //             />
    //           </TabsContent>
    //           <TabsContent value="password">
    //             <DriverForm
    //               handleOnOpenChange={handleOnOpenChange}
    //               activeDriver={drivers.currentDriver}
    //             />
    //           </TabsContent>
    //         </Tabs>
    //       </>
    //     )}

    //     {/* Option 2: use is logged in and allows for user to select existing drivers
    //       as well as add new drivers to the database
    //     */}
    //     {status === "unauthenticated" && (
    //       <DriverForm
    //         handleOnOpenChange={handleOnOpenChange}
    //         activeDriver={drivers.currentDriver}
    //       />
    //     )}
    //   </SheetContent>
    // </Sheet>
  );
};
