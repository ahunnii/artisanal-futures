import { useMemo, useState, type FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { Accordion } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "~/components/ui/use-toast";

import DriverDetailsSection from "../forms/driver-details.form";
import ShiftDetailsSection from "../forms/shift-details.form";
import VehicleDetailsSection from "../forms/vehicle-details.form";

import {
  driverFormSchema,
  type DriverFormValues,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";

import type { Coordinates } from "../../types";

import { useSession } from "next-auth/react";
import { AlertModal } from "~/apps/admin/components/modals/alert-modal";
import { IconButton } from "~/apps/forum/components/icon-button";
import { AlertDescription } from "~/components/ui/alert";
import { api } from "~/utils/api";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import {
  secondsToMinutes,
  unixSecondsToMilitaryTime,
} from "../../libs/format-csv.wip";
import { formatDriverFormDataToBundle } from "../../utils/driver-vehicle/format-drivers.wip";

type TDriverForm = {
  handleOnOpenChange: (data: boolean) => void;
  activeDriver?: DriverVehicleBundle | null;
};

const DriverForm: FC<TDriverForm> = ({ handleOnOpenChange, activeDriver }) => {
  const { drivers: depotDrivers } = useDriverVehicleBundles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { status } = useSession();

  const drivers = depotDrivers.all;

  const { data: databaseDrivers } = api.drivers.getCurrentDepotDrivers.useQuery(
    {
      depotId: 1,
    }
  );

  const defaultValues: DriverFormValues = {
    id: activeDriver?.driver.id ?? uniqueId("driver_"),
    type: activeDriver?.driver.type ?? "TEMP",
    name: activeDriver?.driver.name ?? "",
    email: activeDriver?.driver.email ?? "",
    phone: activeDriver?.driver.phone ?? "",
    address: {
      formatted: activeDriver?.driver.address.formatted ?? undefined,
      latitude: activeDriver?.driver.address.latitude ?? undefined,
      longitude: activeDriver?.driver.address.longitude ?? undefined,
    } as Coordinates & { formatted: string },

    shiftStart: activeDriver?.vehicle.shiftStart
      ? unixSecondsToMilitaryTime(activeDriver?.vehicle.shiftStart)
      : "09:00",
    shiftEnd: activeDriver?.vehicle.shiftEnd
      ? unixSecondsToMilitaryTime(activeDriver?.vehicle.shiftEnd)
      : "17:00",

    breaks:
      activeDriver?.vehicle.breaks && activeDriver?.vehicle.breaks.length > 0
        ? activeDriver?.vehicle.breaks.map((b) => ({
            ...b,
            duration: secondsToMinutes(b.duration),
          }))
        : [],
    maxTravelTime: activeDriver?.vehicle.maxTravelTime
      ? secondsToMinutes(activeDriver.vehicle.maxTravelTime)
      : 100,
    maxTasks: activeDriver?.vehicle.maxTasks ?? 100,
    maxDistance: activeDriver?.vehicle.maxDistance ?? 100,
    capacity: 100,
  };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues,
  });

  function onSubmit(data: DriverFormValues) {
    if (activeDriver)
      depotDrivers.updateDriver(
        data.id,
        formatDriverFormDataToBundle(data),
        false
      );
    else depotDrivers.addDriver(formatDriverFormDataToBundle(data), false);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    handleOnOpenChange(false);
  }

  const onDelete = () => {
    const temp = drivers.filter(
      (loc) => loc.driver.id !== activeDriver?.driver.id
    );
    depotDrivers.setDrivers({ drivers: temp, saveToDB: false });
    handleOnOpenChange(false);
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />

      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          onChange={() => console.log(form.formState.errors)}
          className="  flex  h-full w-full flex-col space-y-8  md:h-[calc(100vh-15vh)] lg:flex-grow"
        >
          {activeDriver && (
            <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  size="icon"
                  variant={"destructive"}
                  onClick={() => setOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>

                {status === "authenticated" && (
                  <Button type="submit" className="flex-1" variant={"outline"}>
                    {activeDriver ? "Set as driver default" : "Save and add"}
                  </Button>
                )}

                <Button type="submit" className="flex-1">
                  {activeDriver ? "Update" : "Add"} driver
                </Button>
              </div>
            </div>
          )}

          {!activeDriver && (
            <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                {status === "authenticated" && (
                  <Button type="submit" className="flex-1" variant={"outline"}>
                    Save driver to depot
                  </Button>
                )}

                <Button type="submit" className="flex-1">
                  Add driver
                </Button>
              </div>
            </div>
          )}
          <ScrollArea className=" h-full w-full flex-1  max-md:max-h-[60vh]">
            <Accordion
              type="single"
              collapsible
              className="w-full px-4"
              defaultValue="item-1"
            >
              <DriverDetailsSection
                form={form}
                databaseDrivers={databaseDrivers ?? []}
              />

              <VehicleDetailsSection form={form} />
              <ShiftDetailsSection form={form} />
            </Accordion>
          </ScrollArea>
          <div className="mt-auto flex gap-4 ">
            {/* <Button
              type="button"
              className="flex gap-4"
              variant={"destructive"}
              onClick={onDelete}
            >
              <Trash />
              Delete
            </Button>
            <Button type="submit" className="flex-1">
              {activeDriver ? "Update" : "Add"} driver
            </Button> */}
          </div>
        </form>
      </Form>
    </>
  );
};

export default DriverForm;
