import { type FC } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";

import { Accordion } from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import { Form } from "~/components/ui/form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "~/components/ui/use-toast";

import DriverDetailsSection from "./driver-details.form";
import ShiftDetailsSection from "./shift-details.form";
import VehicleDetailsSection from "./vehicle-details.form";

import type { Coordinates } from "../../types";
import { driverFormSchema, type DriverFormValues } from "../../types.wip";

import { useDrivers } from "~/apps/solidarity-routing/hooks/use-drivers";

import { api } from "~/utils/api";

type TDriverForm = {
  handleOnOpenChange: (data: boolean) => void;
};

const DriverForm: FC<TDriverForm> = ({ handleOnOpenChange }) => {
  const { appendDriver, updateDriver, activeDriver, drivers, setDrivers } =
    useDrivers((state) => state);

  const { data: databaseDrivers } = api.drivers.getCurrentDepotDrivers.useQuery(
    {
      depotId: 1,
    }
  );

  const defaultValues: DriverFormValues = {
    id: activeDriver?.id ?? parseInt(uniqueId()),
    databaseDriverId: undefined,
    name: activeDriver?.name ?? "",

    address: {
      formatted: activeDriver?.address ?? undefined,
      latitude: activeDriver?.coordinates?.latitude ?? undefined,
      longitude: activeDriver?.coordinates?.longitude ?? undefined,
    } as Coordinates & { formatted: string },

    shift: activeDriver?.time_window
      ? {
          start: activeDriver?.time_window?.startTime,
          end: activeDriver?.time_window?.endTime,
        }
      : { start: "09:00", end: "17:00" },
    breaks: activeDriver?.break_slots
      ? activeDriver?.break_slots.map((b) => ({
          duration: b.service,
          id: parseInt(uniqueId()),
        }))
      : [],

    maxTravelTime: activeDriver?.max_travel_time ?? 100,
    maxTasks: activeDriver?.max_stops ?? 100,
    maxDistance: 100,
  };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues,
  });

  function onSubmit(data: DriverFormValues) {
    // if (activeDriver) updateDriver(data.id, data);
    // else appendDriver(data);

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
    const temp = drivers.filter((loc) => loc.id !== activeDriver?.id);
    setDrivers(temp);
    handleOnOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full w-full flex-col space-y-8 md:h-[calc(100vh-15vh)] lg:flex-grow"
      >
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
          <Button
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
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default DriverForm;
