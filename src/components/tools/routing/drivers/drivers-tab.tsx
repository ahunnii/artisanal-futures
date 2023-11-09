import DriverCard from "~/components/tools/routing/drivers/driver_card";
import DriverSheet from "~/components/tools/routing/drivers/driver_sheet";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/map-sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions, {
  ImportOptionsBtn,
} from "~/components/tools/routing/ui/tab_options";

import { ChevronRight } from "lucide-react";
import { useParams } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import DriverMinimalCard from "./driver-minimal-card";

/**
 * Tab container component that allows users to add, edit, and delete drivers.
 */
const DriversTab = () => {
  const { drivers, activeDriver } = useDrivers((state) => state);

  return (
    <>
      <TabOptions type="driver" />

      {drivers.length == 0 && (
        <div className="flex w-full flex-grow">
          <FileUpload dataType="driver" />
        </div>
      )}

      <DriverSheet driver={activeDriver} />

      <div className="flex h-full w-full grow flex-col justify-start gap-4 overflow-y-auto p-4 py-3 ">
        {drivers.length > 0 &&
          drivers.map((driver, idx) => (
            <DriverCard key={idx} driver={driver} />
          ))}
      </div>
    </>
  );
};

export const DriversDynamicTab = () => {
  const { drivers } = useDrivers((state) => state);
  const params = useParams();
  const { data: databaseDrivers } = api.drivers.getOwnedDrivers.useQuery(
    {
      depotId: (params?.depot as string) ?? null,
    },
    {
      enabled: !!params?.depot,
    }
  );
  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Drivers{" "}
            <span className="rounded-lg border border-slate-300 px-2">
              {drivers?.length ?? 0}
            </span>
          </h2>
          {drivers?.length !== 0 && <ImportOptionsBtn type="driver" />}
          {/* {databaseDrivers?.length !== 0 && (
            <Sheet>
              <SheetTrigger>Open</SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Are you sure absolutely sure?</SheetTitle>
                  <SheetDescription>
                    This action cannot be undone. This will permanently delete
                    your account and remove your data from our servers.
                  </SheetDescription>
                </SheetHeader>

                <div className="flex flex-col gap-4">
                  {databaseDrivers &&
                    databaseDrivers?.length > 0 &&
                    databaseDrivers?.map((driver, idx) => (
                      <div
                        className={cn(
                          "flex w-full items-center justify-between p-3 text-left font-medium shadow odd:bg-slate-300/50 even:bg-slate-100 hover:ring-1 hover:ring-slate-800/30"
                          // activeDriver?.id === driver.id &&
                          // "odd:bg-indigo-300/50 even:bg-indigo-100"
                        )}
                        key={idx}
                      >
                        <span className="group w-10/12 cursor-pointer">
                          <h2
                            className={cn(
                              "text-sm font-bold capitalize "
                              // activeDriver?.id === driver.id
                              //   ? "text-indigo-800 "
                              //   : "text-slate-800 "
                            )}
                          >
                            {driver.name}
                          </h2>
                        </span>
                        <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
                      </div>
                    ))}
                </div>
              </SheetContent>
            </Sheet>
          )} */}
        </div>
        {drivers?.length === 0 && (
          <p>No drivers have been added to this route yet.</p>
        )}

        {drivers?.length === 0 && (
          <TabOptions
            type="driver"
            className="flex-col items-stretch  shadow-none"
          />
        )}
      </div>

      <ScrollArea className=" px-4">
        {drivers.length > 0 &&
          drivers.map((driver, idx) => (
            <>
              <DriverMinimalCard key={idx} driver={driver} />
            </>
          ))}
      </ScrollArea>
    </>
  );
};

export default DriversTab;
