import { zodResolver } from "@hookform/resolvers/zod";
import { uniqueId } from "lodash";

import { useState, type FC } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Accordion } from "~/components/ui/accordion";

import { Form } from "~/components/ui/form";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "~/components/ui/use-toast";

import type { DepotValues } from "~/apps/solidarity-routing/types.wip";

import type { Coordinates } from "../../types";

import { useSession } from "next-auth/react";
import { AlertModal } from "~/apps/admin/components/modals/alert-modal";

import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";

import DepotDetailsForm from "../forms/depot-details-form";

type TDriverForm = {
  handleOnOpenChange: (data: boolean) => void;
  activeDriver?: DepotValues | null;
};

export const depotFormSchema = z.object({
  id: z.number(),

  depotAddressId: z.string().optional(),

  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),

  address: z.object({
    formatted: z.string(),
    latitude: z.number(),
    longitude: z.number(),
  }),
});
export type DepotFormValues = z.infer<typeof depotFormSchema>;

const DepotForm: FC<TDriverForm> = ({ handleOnOpenChange, activeDriver }) => {
  const drivers = useDriverVehicleBundles();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { status } = useSession();

  // const drivers = drivers.data;

  // const databaseDrivers = depotDrivers.onlyDrivers;

  const defaultValues: DepotFormValues = {
    id: activeDriver?.id ?? Number(uniqueId()),
    name: activeDriver?.name ?? "",
    depotAddressId: activeDriver?.depotAddressId,

    address: {
      formatted: activeDriver?.address?.formatted ?? undefined,
      latitude: activeDriver?.address?.latitude ?? undefined,
      longitude: activeDriver?.address?.longitude ?? undefined,
    } as Coordinates & { formatted: string },
  };

  const form = useForm<DepotFormValues>({
    resolver: zodResolver(depotFormSchema),
    defaultValues,
  });

  function onSubmit(data: DepotFormValues) {
    // if (activeDriver)
    //   drivers.updateDriver({
    //     bundle: formatDriverFormDataToBundle(data),
    //   });
    // else drivers.create({ driver: formatDriverFormDataToBundle(data) });

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
    // drivers.deleteFromRoute({ vehicleId: activeDriver?.vehicle.id });
    handleOnOpenChange(false);
  };

  // const updateDefault = (data: DriverFormValues) => {
  //   const temp = formatDriverFormDataToBundle(data);
  //   drivers.updateDefaults(activeDriver?.driver?.defaultVehicleId, temp);
  // };

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
          {/* {activeDriver && (
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
                  <Button
                    type="button"
                    className="flex-1"
                    variant={"outline"}
                    onClick={() => {
                      updateDefault(form.getValues());
                    }}
                  >
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
          )} */}

          <ScrollArea className=" h-full w-full flex-1  max-md:max-h-[60vh]">
            <Accordion
              type="single"
              collapsible
              className="w-full px-4"
              defaultValue="item-1"
            >
              {/* <VehicleDetailsSection form={form} />
              <ShiftDetailsSection form={form} /> */}
              <DepotDetailsForm form={form} />
            </Accordion>
          </ScrollArea>
          <div className="mt-auto flex gap-4 "></div>
        </form>
      </Form>
    </>
  );
};

export default DepotForm;
