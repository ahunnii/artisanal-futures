import { zodResolver } from "@hookform/resolvers/zod";
import { Navigation, PackageCheckIcon, PackageXIcon } from "lucide-react";
import { type FC } from "react";

import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { RouteStatus } from "@prisma/client";
import Link from "next/link";
import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { api } from "~/utils/api";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

import { notificationService } from "~/services/notification";
import type { OptimizedStop } from "../../types.wip";

const notificationsFormSchema = z.object({
  status: z.nativeEnum(RouteStatus, {
    required_error: "You need to select a notification type.",
  }),
  deliveryNotes: z.string().optional(),
});

export type EditStopFormValues = z.infer<typeof notificationsFormSchema>;

// This can come from your database or API.

type TProps = {
  initialData?: OptimizedStop | null;
};

const CurrentStopForm: FC<TProps> = ({ initialData }) => {
  const jobBundles = useClientJobBundles();

  const apiContext = api.useContext();

  const updateStopStatus = api.routePlan.updateOptimizedStopState.useMutation({
    onSuccess: () => {
      notificationService.notifySuccess({
        message: "Stop status was successfully updated.",
      });
    },
    onError: (error: unknown) => {
      notificationService.notifyError({
        message: "There was an issue updating the stop status.",
        error,
      });
    },
    onSettled: () => {
      jobBundles.onFieldJobSheetOpen(false);
      void apiContext.routePlan.invalidate();
    },
  });

  const defaultValues: Partial<EditStopFormValues> = {
    status: initialData?.status ?? RouteStatus.PENDING,
    deliveryNotes: initialData?.notes ?? undefined,
  };

  const form = useForm<EditStopFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  function onSubmit(data: EditStopFormValues) {
    if (initialData) {
      updateStopStatus.mutate({
        state: data.status,
        stopId: initialData.id,
        notes: data.deliveryNotes,
      });
    }
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="space-y-8 px-4"
        >
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem className="space-y-1">
                <div className=" flex h-16  w-full items-center justify-between">
                  <Link
                    href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(
                      initialData?.job?.address?.formatted ?? ""
                    )}`}
                    target="_blank"
                    className="h-full"
                  >
                    {" "}
                    <Button
                      type="button"
                      className=" py-auto my-auto flex h-full flex-col justify-center bg-blue-600 text-white hover:bg-blue-600/75"
                    >
                      <Navigation className="h-5 w-5" />
                      Navigate
                    </Button>
                  </Link>
                  <div>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex h-full  items-center gap-2"
                    >
                      <FormItem className="py-auto my-auto h-full">
                        <FormLabel className="h-full [&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-red-100">
                          <FormControl>
                            <RadioGroupItem
                              value="FAILED"
                              className="sr-only"
                            />
                          </FormControl>

                          <div className=" flex h-full w-full flex-col items-center justify-center space-y-2 rounded-md border bg-slate-100 p-2  px-6 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-red-200/50">
                            <PackageXIcon className="h-5 w-5 text-red-500" />
                            <span>Failed</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                      <FormItem>
                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary [&:has([data-state=checked])>div]:bg-green-100">
                          <FormControl>
                            <RadioGroupItem
                              value="COMPLETED"
                              className="sr-only"
                            />
                          </FormControl>

                          <div className=" flex h-full w-full flex-col items-center justify-center space-y-2 rounded-md border bg-slate-100 p-2  px-6 text-sm font-medium transition-all duration-200 ease-in-out hover:bg-green-200/50">
                            <PackageCheckIcon className="h-5 w-5 text-green-500" />
                            <span>Delivered</span>
                          </div>
                        </FormLabel>
                      </FormItem>
                    </RadioGroup>
                  </div>
                </div>{" "}
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="flex flex-col  justify-between rounded-lg border p-4">
            <p>Job #{initialData?.jobId}</p>
            <p>
              Client&apos;s Name:{" "}
              {initialData?.job?.client?.name ??
                "No client associated with this stop"}
            </p>

            <p>
              Order Details: {initialData?.job?.order ?? "No details given"}
            </p>

            <p>Notes: {initialData?.notes ?? "No notes found"}</p>
          </FormItem>
          <FormField
            control={form.control}
            name="deliveryNotes"
            render={({ field }) => (
              <FormItem className="flex flex-col  justify-between rounded-lg border p-4">
                <FormControl>
                  <AutoResizeTextArea
                    {...field}
                    rows={2}
                    maxHeight={75}
                    placeholder="Add a note..."
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Update stop
          </Button>
        </form>
      </Form>
    </>
  );
};

export default CurrentStopForm;
