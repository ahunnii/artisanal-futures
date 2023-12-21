import { zodResolver } from "@hookform/resolvers/zod";
import type { Shop } from "@prisma/client";
import { useJsApiLoader } from "@react-google-maps/api";

import { useState, type FC } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
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
import { env } from "~/env.mjs";
import { useDepotModal } from "~/hooks/routing/use-depot-modal";
import { api } from "~/utils/api";
const formSchema = z.object({
  name: z.string().min(1),
  address: z.string(),
  coordinates: z.object({
    lat: z.number().default(0),
    lng: z.number().default(0),
  }),
});
type Library = "places";
const libraries: Library[] = ["places"];
interface IProps {
  shop: Shop | null;
}
export const DepotModal: FC<IProps> = ({ shop }) => {
  const storeModal = useDepotModal();

  const { address, city, state } = shop ?? {};

  const { mutate } = api.depots.createDepot.useMutation({
    onSuccess: ({ id }) => {
      window.location.assign(`/tools/routing/depot/${id}`);
      setLoading(false);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: shop ? shop.shopName : "",
      address: shop ? `${address}, ${city}, ${state}` : "",
      coordinates: {
        lat: 0,
        lng: 0,
      },
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (values.coordinates?.lat === 0 || values.coordinates?.lng === 0) {
      await geocodeByAddress(values.address)
        .then((results) => getLatLng(results[0]!))
        .then(({ lat, lng }) => {
          form.setValue("coordinates", {
            lat,
            lng,
          });

          mutate({
            ...values,
            coordinates: {
              lat,
              lng,
            },
          });
        })
        .catch((err) => {
          console.error("Error", err);
          form.setError("address", {
            message: "Invalid address",
          });
        });
    }
  };
  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });
  return (
    <Modal
      title="Create depot"
      description="Add a new store to manage products and categories."
      isOpen={storeModal.isOpen}
      onClose={storeModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            disabled={loading}
                            placeholder="E-Commerce"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />{" "}
                  {isLoaded && (
                    <Controller
                      name="address"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <FormItem>
                          <FormLabel>Depot Address</FormLabel>

                          <GooglePlacesAutocomplete
                            selectProps={{
                              defaultInputValue: value,
                              onChange: (e) => {
                                if (!e) return;

                                onChange(e.label);
                                geocodeByAddress(e.label)
                                  .then((results) => getLatLng(results[0]!))
                                  .then(({ lat, lng }) => {
                                    form.setValue("coordinates", {
                                      lat,
                                      lng,
                                    });
                                  })
                                  .catch((err) => console.error("Error", err));
                              },
                              classNames: {
                                control: (state) =>
                                  state.isFocused
                                    ? "border-red-600"
                                    : "border-grey-300",
                                input: () => "text-bold",
                              },
                              styles: {
                                input: (provided) => ({
                                  ...provided,
                                  outline: "0px solid",
                                }),
                              },
                            }}
                          />

                          <FormDescription>
                            This is where your drivers will start and end their
                            routes. (Unless specified further)
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </div>

                <div className="flex w-full items-center justify-end space-x-2 pt-6">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={storeModal.onClose}
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
