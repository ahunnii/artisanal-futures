import { zodResolver } from "@hookform/resolvers/zod";

import { uniqueId } from "lodash";
import { Pencil, Trash } from "lucide-react";
import { useState, type FC } from "react";

import { useForm } from "react-hook-form";

import { Button } from "~/components/ui/button";

import { Form } from "~/components/ui/form";

import type { Coordinates } from "~/apps/solidarity-routing/types";

import { toast } from "~/components/ui/use-toast";

import { useSession } from "next-auth/react";
import { AlertModal } from "~/apps/admin/components/modals/alert-modal";
import { Accordion } from "~/components/ui/accordion";

import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import {
  stopFormSchema,
  type ClientJobBundle,
  type StopFormValues,
} from "../../types.wip";
import { formatJobFormDataToBundle } from "../../utils/client-job/format-clients.wip";
import {
  secondsToMinutes,
  unixSecondsToMilitaryTime,
} from "../../utils/generic/format-utils.wip";

import ClientDetailsSection from "./client-detail-form";
import StopDetailsSection from "./job-details-form";

type TStopForm = {
  handleOnOpenChange: (data: boolean) => void;
  activeLocation?: ClientJobBundle | null;
};

const StopForm: FC<TStopForm> = ({ handleOnOpenChange, activeLocation }) => {
  const jobs = useClientJobBundles();
  const [open, setOpen] = useState(false);
  const [loading] = useState(false);
  const [editClient, setEditClient] = useState(false);
  const { status } = useSession();

  const [, setAccordionValue] = useState(activeLocation ? "item-2" : "item-1");

  const defaultValues: Partial<StopFormValues> = {
    id: activeLocation?.job.id ?? uniqueId("job_"),
    clientId: activeLocation?.client?.id ?? undefined,

    addressId: activeLocation?.job.addressId ?? uniqueId("address_"),
    clientAddressId: activeLocation?.client?.addressId ?? undefined,

    type: activeLocation?.job.type ?? "DELIVERY",

    name: activeLocation?.client?.name ?? `Job #${activeLocation?.job.id}`,

    address: {
      formatted: activeLocation?.job.address.formatted ?? "",
      latitude: activeLocation?.job.address.latitude ?? undefined,
      longitude: activeLocation?.job.address.longitude ?? undefined,
    } as Coordinates & { formatted: string },

    clientAddress: {
      formatted:
        activeLocation?.client?.address?.formatted ??
        activeLocation?.job.address.formatted,
      latitude:
        activeLocation?.client?.address?.latitude ??
        activeLocation?.job.address.latitude,
      longitude:
        activeLocation?.client?.address?.longitude ??
        activeLocation?.job.address.longitude,
    } as Coordinates & { formatted: string },

    timeWindowStart: activeLocation?.job.timeWindowStart
      ? unixSecondsToMilitaryTime(activeLocation?.job.timeWindowStart)
      : "09:00",
    timeWindowEnd: activeLocation?.job.timeWindowEnd
      ? unixSecondsToMilitaryTime(activeLocation?.job.timeWindowEnd)
      : "17:00",

    serviceTime: activeLocation?.job.serviceTime
      ? secondsToMinutes(activeLocation.job.serviceTime)
      : 5,
    prepTime: activeLocation?.job.prepTime
      ? secondsToMinutes(activeLocation.job.prepTime)
      : 5,

    priority: activeLocation?.job.priority ?? 1,
    email: activeLocation?.client?.email ?? undefined,
    order: activeLocation?.job.order ?? "",
    notes: activeLocation?.job.notes ?? "",
  };

  const form = useForm<StopFormValues>({
    resolver: zodResolver(stopFormSchema),
    defaultValues,
  });

  function onSubmit(data: StopFormValues) {
    if (activeLocation) {
      jobs.updateJob({ bundle: formatJobFormDataToBundle(data) });

      if (editClient && data?.clientId && !data?.clientId.includes("client_")) {
        jobs.updateClient({ bundle: formatJobFormDataToBundle(data) });
      }
    } else {
      jobs.create({ job: formatJobFormDataToBundle(data), addToRoute: true });
    }

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
    jobs.deleteJob({ id: activeLocation?.job.id });
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
          className="  flex  h-full max-h-[calc(100vh-50vh)] w-full flex-col  space-y-8 md:h-[calc(100vh-15vh)] lg:flex-grow"
        >
          {activeLocation && (
            <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <Button type="submit" className="flex-1">
                  {activeLocation ? "Update" : "Add"} stop
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

          {!activeLocation && (
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
              className="w-full px-4"
              defaultValue="item-1"
            >
              <StopDetailsSection form={form} />

              <ClientDetailsSection form={form} editClient={editClient} />
            </Accordion>
          </div>
        </form>
      </Form>

      {activeLocation?.client && (
        <div className=" mt-auto  w-full flex-col  gap-2 space-y-0.5 border-t  pt-4">
          <div className="flex w-full">
            <Button
              variant={"link"}
              className={cn(
                " m-0 items-center  gap-1 p-0",
                editClient && "hidden"
              )}
              onClick={() => {
                setEditClient((prev) => !prev);
                setAccordionValue("item-1");
              }}
            >
              <Pencil className="h-4 w-4" />
              Edit details for {activeLocation?.client.name}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default StopForm;
