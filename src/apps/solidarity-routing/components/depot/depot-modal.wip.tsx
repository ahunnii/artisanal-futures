import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Modal } from "~/components/ui/modal";

import { useDepotModal } from "~/apps/solidarity-routing/hooks/use-depot-modal.wip";
import { api } from "~/utils/api";

import type { DepotValues } from "../../types.wip";
import { AutoCompleteDepotBtn } from "../forms/autocomplete-depot-btn";

const formSchema = z.object({
  name: z.string().min(1).optional(),
  address: z
    .object({
      formatted: z.string().optional(),
      latitude: z.number().optional(),
      longitude: z.number().optional(),
    })
    .optional(),
});

type TDepotForm = z.infer<typeof formSchema>;
export const DepotModal = ({
  initialData,
}: {
  initialData: DepotValues | null;
}) => {
  const depotModal = useDepotModal();
  const apiContext = api.useContext();

  const { mutate: createDepot } = api.depots.createDepot.useMutation({
    onSuccess: ({ id }) =>
      window.location.assign(`/tools/solidarity-pathways/${id}`),
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });

  const { mutate: updateDepot } = api.depots.updateDepot.useMutation({
    onSuccess: () => toast.success("Depot updated!"),
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      void apiContext.depots.invalidate();
      depotModal.onClose();
    },
  });
  const [loading, setLoading] = useState(false);

  const form = useForm<TDepotForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      address: {
        formatted: initialData?.address?.formatted ?? undefined,
        latitude: initialData?.address?.latitude ?? undefined,
        longitude: initialData?.address?.longitude ?? undefined,
      },
    },
  });

  const onSubmit = (values: TDepotForm) => {
    console.log(values);
    if (initialData)
      updateDepot({
        depotId: initialData.id,
        name: values.name,
        address:
          values.address?.formatted &&
          values.address?.latitude &&
          values.address?.longitude
            ? {
                formatted: values.address?.formatted,
                latitude: values.address?.latitude,
                longitude: values.address?.longitude,
              }
            : undefined,
      });
    else
      createDepot({
        name: values.name,
        address:
          values.address?.formatted &&
          values.address?.latitude &&
          values.address?.longitude
            ? {
                formatted: values.address?.formatted,
                latitude: values.address?.latitude,
                longitude: values.address?.longitude,
              }
            : undefined,
      });
  };

  return (
    <Modal
      title={initialData ? "Edit Depot" : "Create Depot"}
      description={
        initialData
          ? "Edit your depot details"
          : "Create a new depot to get started with routing."
      }
      isOpen={depotModal.isOpen}
      onClose={depotModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. Deep Blue Sea Delivery"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Controller
                  name="address.formatted"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Job Address
                      </FormLabel>

                      <div className="flex gap-1">
                        <AutoCompleteDepotBtn<TDepotForm>
                          value={value}
                          onChange={onChange}
                          onLatLngChange={(lat, lng) => {
                            form.setValue("address.latitude", lat);
                            form.setValue("address.longitude", lng);
                          }}
                          form={form}
                          formKey="address"
                        />
                      </div>
                      <FormDescription className="text-xs text-muted-foreground/75">
                        This is where the job gets fulfilled. It defaults to the
                        client&apos;s address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex w-full items-center justify-end space-x-2 pt-6">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={depotModal.onClose}
                  >
                    Cancel
                  </Button>{" "}
                  <Button disabled={loading} type="submit">
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
