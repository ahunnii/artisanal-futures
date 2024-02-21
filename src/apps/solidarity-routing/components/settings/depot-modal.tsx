import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import type * as z from "zod";

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

import { AutoCompleteDepotBtn } from "~/apps/solidarity-routing/components/shared/autocomplete-depot-btn";

import { useDepotModal } from "~/apps/solidarity-routing/hooks/depot/use-depot-modal.wip";

import { depotFormSchema } from "~/apps/solidarity-routing/schemas.wip";
import type { DepotValues } from "~/apps/solidarity-routing/types.wip";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { useDepot } from "~/apps/solidarity-routing/hooks/depot/use-depot";

type TDepotForm = z.infer<typeof depotFormSchema>;

type Props = {
  initialData: DepotValues | null;
};
export const DepotModal = ({ initialData }: Props) => {
  const depotModal = useDepotModal();
  const { createDepot, updateDepot } = useDepot();
  const { data: session } = useSession();

  const isLoading = initialData ? updateDepot.isLoading : createDepot.isLoading;

  const form = useForm<TDepotForm>({
    resolver: zodResolver(depotFormSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      address: initialData?.address
        ? {
            formatted: initialData?.address?.formatted,
            latitude: initialData?.address?.latitude,
            longitude: initialData?.address?.longitude,
          }
        : undefined,
      magicCode: initialData?.magicCode ?? "",
    },
  });

  const onDepotFormSubmit = (values: TDepotForm) => {
    if (initialData)
      updateDepot.mutate({
        ...values,
        depotId: initialData.id,
        address:
          values.address?.formatted &&
          values.address?.latitude &&
          values.address?.longitude
            ? { ...values.address }
            : undefined,
      });
    else
      createDepot.mutate({
        ...values,

        address:
          values.address?.formatted &&
          values.address?.latitude &&
          values.address?.longitude
            ? { ...values.address }
            : undefined,
      });
  };

  const setLatLng = (lat: number, lng: number) => {
    form.setValue("address.latitude", lat);
    form.setValue("address.longitude", lng);
  };

  return (
    <Modal
      title={initialData ? "Edit Depot" : "Create Depot"}
      description={
        initialData
          ? "Edit your depot details"
          : "Create a new depot to get started with Solidarity Pathways."
      }
      isOpen={depotModal.isOpen}
      onClose={depotModal.onClose}
    >
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onDepotFormSubmit)(e)}
          className="space-y-4 "
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Name
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="e.g. Deep Blue Sea Delivery"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="magicCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Magic Code
                </FormLabel>
                <FormControl>
                  <Input
                    disabled={isLoading}
                    placeholder="e.g. super-secret-code-1234"
                    {...field}
                  />
                </FormControl>
                <FormDescription className="text-xs text-muted-foreground/75">
                  This code allows your drivers to access the route page
                </FormDescription>
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
                  Depot Address
                </FormLabel>

                <AutoCompleteDepotBtn<TDepotForm>
                  value={value}
                  onChange={onChange}
                  onLatLngChange={setLatLng}
                  form={form}
                  formKey="address"
                />

                <FormDescription className="text-xs text-muted-foreground/75">
                  Address of the depot. Vehicle starting and ending locations
                  will default to this location.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex w-full items-center justify-end space-x-2 pt-6">
            {!initialData && (
              <Link href="/tools/solidarity-pathways/sandbox">
                <Button variant="outline" type="button">
                  Nah, I&apos;m good
                </Button>
              </Link>
            )}
            {initialData && (
              <Button
                disabled={isLoading}
                variant="outline"
                onClick={depotModal.onClose}
                type="button"
              >
                Cancel
              </Button>
            )}
            <Button disabled={isLoading} type="submit">
              {initialData ? "Save" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </Modal>
  );
};
