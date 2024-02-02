import { Listbox, Transition } from "@headlessui/react";

import { useSession } from "next-auth/react";
import { Fragment, useState, type ReactNode } from "react";

import { Button } from "~/components/ui/button";

import { cn } from "~/utils/styles";

import { CheckIcon, ChevronDownIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { api } from "~/utils/api";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

export const DriverDBSelect = ({
  handleAddToRoute,
  children,
}: {
  handleAddToRoute: (data: DriverVehicleBundle[]) => void;
  children: ReactNode;
}) => {
  const { status } = useSession();

  const [open, setOpen] = useState(false);
  const [driverBundles, setDriverBundles] = useState<DriverVehicleBundle[]>([]);

  const { data: depotDrivers } =
    api.drivers.getCurrentDepotDriverVehicleBundles.useQuery(
      { depotId: 1 },
      { enabled: status === "authenticated" }
    );

  const clearDrivers = () => {
    setDriverBundles([]);
    setOpen(false);
  };

  const addToRoute = () => {
    if (driverBundles.length === 0) return;
    handleAddToRoute(driverBundles);
    setOpen(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add drivers</DialogTitle>
          <DialogDescription>
            Add drivers with their default settings from the database.
          </DialogDescription>
        </DialogHeader>

        {status !== "authenticated" && (
          <p>In order to import saved drivers, you must login.</p>
        )}
        {status === "authenticated" && !depotDrivers && (
          <p>
            Looks like there are no drivers in the database. You can add a
            driver, or upload a CSV file.
          </p>
        )}

        {status === "authenticated" &&
          depotDrivers &&
          depotDrivers.length > 0 && (
            <div className="relative z-30 w-full">
              <Listbox
                value={driverBundles}
                onChange={setDriverBundles}
                multiple
              >
                {/* <Listbox.Label>{data?.name}:</Listbox.Label> */}

                <div className="relative ">
                  <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-indigo-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
                    {driverBundles.length === 0 && (
                      <span className="text-muted-foreground">
                        Select from saved drivers
                      </span>
                    )}

                    {driverBundles.length !== 0 && (
                      <span className="block truncate">
                        {driverBundles
                          .map((bundle) => bundle?.driver.name)
                          .join(", ")}{" "}
                      </span>
                    )}
                    <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                      <ChevronDownIcon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </span>
                  </Listbox.Button>
                  <Transition
                    as={Fragment}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
                      {depotDrivers?.length > 0 &&
                        depotDrivers.map((bundle) => (
                          <Listbox.Option
                            key={bundle.driver.id}
                            className={({ active }) =>
                              `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                active ? "text-slate-500" : "text-gray-900"
                              }`
                            }
                            value={bundle}
                          >
                            {({ selected }) => (
                              <>
                                <span
                                  className={`block truncate ${
                                    selected ? "font-medium" : "font-normal"
                                  }`}
                                >
                                  {bundle.driver.name}
                                </span>
                                {selected ? (
                                  <span
                                    className={cn(
                                      "absolute inset-y-0 left-0 flex items-center pl-3"
                                    )}
                                  >
                                    <CheckIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        ))}
                    </Listbox.Options>
                  </Transition>
                </div>
              </Listbox>
            </div>
          )}
        <DialogFooter>
          <Button type="button" onClick={clearDrivers} variant="outline">
            Cancel
          </Button>
          <Button type="button" onClick={addToRoute}>
            Add to Route
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
