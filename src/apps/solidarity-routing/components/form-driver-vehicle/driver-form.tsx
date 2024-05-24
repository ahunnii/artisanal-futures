import { useEffect, useState, type FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniqueId } from "lodash";
import { FileCog, Pencil, Trash } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";

import { Accordion } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";

import {
  DriverDetailsSection,
  ShiftDetailsSection,
  VehicleDetailsSection,
} from "~/apps/solidarity-routing/components/form-driver-vehicle";

import { AlertModal } from "~/apps/admin/components/modals/alert-modal";

import { formatDriverFormDataToBundle } from "~/apps/solidarity-routing/utils/driver-vehicle/format-drivers.wip";
import {
  metersToMiles,
  phoneFormatStringToNumber,
  secondsToMinutes,
  unixSecondsToMilitaryTime,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";
import { cn } from "~/utils/styles";

import { driverFormSchema } from "~/apps/solidarity-routing/schemas.wip";

import type {
  AutoCompleteCoordinates,
  DriverFormValues,
  DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";

import { useCreateDriver } from "../../hooks/drivers/CRUD/use-create-driver";
import { useDeleteDriver } from "../../hooks/drivers/CRUD/use-delete-driver";
import { useUpdateDriver } from "../../hooks/drivers/CRUD/use-update-driver";

type TDriverForm = {
  handleOnOpenChange: (data: boolean) => void;
  activeDriver?: DriverVehicleBundle | null;
};

const DriverForm: FC<TDriverForm> = ({ handleOnOpenChange, activeDriver }) => {
  const {
    updateRouteVehicle,
    updateDepotDriverDetails,
    updateDepotDriverDefaults,
    updateDriverChannelName,
  } = useUpdateDriver();
  const { deleteDriverFromRoute } = useDeleteDriver();
  const { createNewDriver } = useCreateDriver();

  const [open, setOpen] = useState(false);
  const [editDriver, setEditDriver] = useState(false);

  const { status } = useSession();

  const [accordionValue, setAccordionValue] = useState(
    activeDriver ? "item-2" : "item-1"
  );

  const defaultValues: DriverFormValues = {
    id: activeDriver?.driver?.id ?? uniqueId("driver_"),
    vehicleId: activeDriver?.vehicle.id ?? uniqueId("vehicle_"),
    startAddressId: activeDriver?.vehicle.startAddressId ?? uniqueId("addr_"),
    addressId: activeDriver?.driver.addressId ?? uniqueId("addr_"),
    type: activeDriver?.driver?.type ?? "TEMP",
    name: activeDriver?.driver?.name ?? "",
    email: activeDriver?.driver?.email ?? "",
    phone: phoneFormatStringToNumber(activeDriver?.driver?.phone ?? ""),

    address: {
      formatted: activeDriver?.driver.address.formatted ?? undefined,
      latitude: activeDriver?.driver.address.latitude ?? undefined,
      longitude: activeDriver?.driver.address.longitude ?? undefined,
    } as AutoCompleteCoordinates & { formatted: string },

    startAddress: {
      formatted: activeDriver?.vehicle.startAddress.formatted ?? undefined,
      latitude: activeDriver?.vehicle.startAddress.latitude ?? undefined,
      longitude: activeDriver?.vehicle.startAddress.longitude ?? undefined,
    } as AutoCompleteCoordinates & { formatted: string },

    endAddress: {
      formatted: activeDriver?.vehicle?.endAddress?.formatted ?? undefined,
      latitude: activeDriver?.vehicle?.endAddress?.latitude ?? undefined,
      longitude: activeDriver?.vehicle?.endAddress?.longitude ?? undefined,
    } as AutoCompleteCoordinates & { formatted: string },

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
        : [{ id: Number(uniqueId()), duration: 30 }],
    maxTravelTime: secondsToMinutes(
      activeDriver?.vehicle?.maxTravelTime ?? 300
    ),
    maxTasks: activeDriver?.vehicle.maxTasks ?? 100,
    maxDistance: Math.round(
      metersToMiles(activeDriver?.vehicle.maxDistance ?? 100)
    ),
    capacity: 100,
  };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues,
  });

  useEffect(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 500);
  }, []);

  function onSubmit(data: DriverFormValues) {
    if (activeDriver) {
      updateRouteVehicle({
        bundle: formatDriverFormDataToBundle(data),
      });
      if (editDriver) {
        const email = activeDriver?.driver?.email;
        updateDriverChannelName({
          email: data.email,
          channelName: email,
        });
        updateDepotDriverDetails({
          bundle: formatDriverFormDataToBundle(data),
        });
      }
    } else createNewDriver({ driver: formatDriverFormDataToBundle(data) });

    handleOnOpenChange(false);
  }

  const onDelete = () => {
    deleteDriverFromRoute({ vehicleId: activeDriver?.vehicle.id });
    handleOnOpenChange(false);
  };

  const updateDefault = (data: DriverFormValues) => {
    const temp = formatDriverFormDataToBundle(data);

    updateDepotDriverDefaults({
      id: activeDriver?.driver?.defaultVehicleId,
      bundle: temp,
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={false}
      />

      <Form {...form}>
        <form
          onSubmit={(e) => {
            void form.handleSubmit(onSubmit)(e);
          }}
          className="  flex  h-full max-h-[calc(100vh-50vh)] w-full flex-col  space-y-8 md:h-[calc(100vh-15vh)] lg:flex-grow"
        >
          {activeDriver && (
            <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <Button type="submit" className="flex-1">
                  {activeDriver ? "Update" : "Add"} route vehicle
                </Button>
                <Button
                  type="button"
                  size="icon"
                  variant={"destructive"}
                  onClick={() => setOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
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

          <div className=" flex-1 ">
            <Accordion
              type="single"
              collapsible
              className="flex h-full  w-full flex-col  px-4"
              value={accordionValue}
              onValueChange={setAccordionValue}
            >
              {(!activeDriver || editDriver) && (
                <DriverDetailsSection form={form} />
              )}
              <VehicleDetailsSection form={form} />

              <ShiftDetailsSection form={form} />
            </Accordion>
          </div>
        </form>
      </Form>

      {activeDriver && (
        <div className=" mt-auto  w-full flex-col  gap-2 space-y-0.5 border-t  pt-4">
          <div className="flex w-full">
            <Button
              variant={"link"}
              type="button"
              className=" m-0 items-center  gap-1 p-0"
              onClick={() => {
                console.log(formatDriverFormDataToBundle(form.getValues()));
                updateDefault(form.getValues());
              }}
            >
              <FileCog className="h-4 w-4" />
              Set as default for {activeDriver?.driver.name}
            </Button>
          </div>
          <div className="flex w-full">
            <Button
              variant={"link"}
              className={cn(
                " m-0 items-center  gap-1 p-0",
                editDriver && "hidden"
              )}
              onClick={() => {
                setEditDriver((prev) => !prev);
                setAccordionValue("item-1");
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit details for {activeDriver?.driver.name}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default DriverForm;
