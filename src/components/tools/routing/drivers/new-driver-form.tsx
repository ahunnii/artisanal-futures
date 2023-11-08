import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import { useMemo, useState, type FC } from "react";
import { toast as notificationToast } from "react-hot-toast";

import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

import { Controller, useFieldArray, useForm } from "react-hook-form";
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

import { useParams } from "next/navigation";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { api } from "~/utils/api";
import { parseDataFromDriver } from "~/utils/routing/data-formatting";
import type { Coordinates, Driver } from "../types";

type Library = "places";

const libraries: Library[] = ["places"];
const driverFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),

  address: z.string(),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  email: z.string().email(),
  phone: z.string().min(10).optional(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

// This can come from your database or API.

interface IProps {
  callback: () => void;
}

export const NewDriverForm: FC<IProps> = ({ callback }) => {
  const [loading, setLoading] = useState(false);
  const { appendDriver } = useDrivers((state) => state);
  const { mutate } = api.drivers.createDriver.useMutation({
    onSuccess: ({ id }) => {
      notificationToast.success("Driver added to depot");
      setLoading(false);
    },
    onError: (error) => {
      notificationToast.error("Something went wrong");
      console.error(error);
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });
  const params = useParams();

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
  });

  function onSubmit(data: DriverFormValues) {
    // appendDriver(data);
    const values = {
      ...data,
      depotId: (params.depot! as string) ?? null,
      coordinates: {
        lat: data.coordinates.latitude,
        lng: data.coordinates.longitude,
      },
    };

    mutate(values);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    callback();
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full flex-grow flex-col justify-between space-y-8"
      >
        <ScrollArea className="relative flex h-full w-full flex-1 ">
          <div className=" flex  flex-col  space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your customer's name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {isLoaded && (
              <Controller
                name="address"
                control={form.control}
                defaultValue="11"
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Starting Address</FormLabel>

                    <GooglePlacesAutocomplete
                      selectProps={{
                        defaultInputValue: value,
                        onChange: (e) => {
                          if (!e) return;

                          onChange(e.label);
                          geocodeByAddress(e.label)
                            .then((results) => getLatLng(results[0]!))
                            .then(({ lat, lng }) => {
                              console.log(
                                "Successfully got latitude and longitude",
                                { latitude: lat, longitude: lng }
                              );
                              form.setValue("coordinates", {
                                latitude: lat,
                                longitude: lng,
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
                      This is the address where the driver will deliver the
                      package. Coordinates are <br /> Lat:{" "}
                      {form.watch("coordinates")?.latitude ?? 0} &nbsp; Lng:{" "}
                      {form.watch("coordinates")?.longitude ?? 0}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your customer's name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="Your customer's name" {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ScrollArea>
        <div className="flex  basis-14 gap-4">
          <Button type="submit" className="flex-1">
            Add driver to depot
          </Button>
        </div>
      </form>
    </Form>
  );
};
