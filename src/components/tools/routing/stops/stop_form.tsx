import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import type { FC } from "react";

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
import { Textarea } from "~/components/ui/textarea";

import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import { useStops } from "~/hooks/routing/use-stops";
import type { Stop } from "../types";

const stopFormSchema = z.object({
  id: z.number(),
  customer_name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),

  address: z.string(),
  time_windows: z.array(
    z.object({
      startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Invalid time format. Time must be in HH:MM format.",
      }),
      endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
        message: "Invalid time format. Time must be in HH:MM format.",
      }),
    })
  ),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
  drop_off_duration: z.number().min(0),
  prep_time_duration: z.number().min(0),
  priority: z.number().min(0),
  contact_info: z.string().optional(),
  description: z.string().optional(),
});

type Library = "places";

const libraries: Library[] = ["places"];

type StopFormValues = z.infer<typeof stopFormSchema>;

// This can come from your database or API.

interface IProps {
  initialData: Stop | null;
  callback: () => void;
}

export const StopForm: FC<IProps> = ({ initialData, callback }) => {
  const { appendLocation, updateLocation } = useStops((state) => state);

  const defaultValues: Partial<StopFormValues> = {
    id: initialData?.id ?? parseInt(uniqueId()),
    customer_name: initialData?.customer_name ?? "",
    address: initialData?.address ?? "",
    time_windows: initialData?.time_windows ?? [
      { startTime: "00:00", endTime: "00:00" },
    ],
    coordinates: initialData?.coordinates ?? { latitude: 0, longitude: 0 },
    drop_off_duration: initialData?.drop_off_duration ?? 0,
    prep_time_duration: initialData?.prep_time_duration ?? 0,
    priority: initialData?.priority ?? 0,
    contact_info: initialData?.contact_info ?? "",
    description: initialData?.description ?? "",
  };

  const form = useForm<StopFormValues>({
    resolver: zodResolver(stopFormSchema),
    defaultValues,
  });

  function onSubmit(data: StopFormValues) {
    if (initialData) {
      updateLocation(data.id, data);
    } else {
      appendLocation(data);
    }
    callback();
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "time_windows",
  });
  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full flex-grow flex-col justify-between space-y-8"
      >
        <div className=" flex  flex-col  space-y-8">
          <FormField
            control={form.control}
            name="customer_name"
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
                  <FormLabel>Fulfillment Address</FormLabel>

                  <GooglePlacesAutocomplete
                    selectProps={{
                      // inputValue: value,
                      defaultInputValue: value,
                      onChange: (e) => {
                        if (!e) return;
                        console.log(e);
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
          <div className="flex  flex-auto gap-4">
            <FormField
              control={form.control}
              name="prep_time_duration"
              render={({ field }) => (
                <FormItem className="flex-1 ">
                  <FormLabel>Prep Time Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 30"
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    How long should the driver take to prep the order? (i.e.
                    getting it ready, loading it into the vehicle, etc.)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="drop_off_duration"
              render={({ field }) => (
                <FormItem className="flex-1 ">
                  <FormLabel>Drop Off Duration</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 30"
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    How long should the fulfillment take? (in minutes)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem className="flex-1 ">
                  <FormLabel>Priority</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 30"
                      {...field}
                      type="number"
                      onChange={(e) => {
                        field.onChange(Number(e.target.value));
                      }}
                    />
                  </FormControl>
                  <FormDescription>
                    On a scale of 0 - 100, with 100 being the highest priority,
                    how important is this stop? (Leave at 1 if not all stops
                    should be treated equally)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormLabel>Time Windows</FormLabel>
            <div className="flex max-h-96 flex-col overflow-y-auto">
              {fields.map((item, index) => (
                <div key={item.id} className="my-2 flex items-center space-x-4">
                  <Controller
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Attribute (e.g., Size, Color)"
                        type="time"
                      />
                    )}
                    name={`time_windows.${index}.startTime`}
                    control={form.control}
                    defaultValue={item.startTime.trim()}
                  />

                  <Controller
                    render={({ field }) => (
                      <Input
                        {...field}
                        placeholder="Value (e.g., M, Red)"
                        type="time"
                      />
                    )}
                    name={`time_windows.${index}.endTime`}
                    control={form.control}
                    defaultValue={item.endTime.trim()}
                  />

                  <Button
                    onClick={() => remove(index)}
                    variant="destructive"
                    type="button"
                  >
                    <Trash />
                  </Button>
                </div>
              ))}
            </div>
            <FormDescription>
              Add a list of time windows for this stop that the delivery driver
              can arrive at.
            </FormDescription>{" "}
            <FormMessage />
            <Button
              onClick={() => append({ startTime: "00:00", endTime: "00:00" })}
              type="button"
            >
              Add Time Slot
            </Button>
          </div>
          <FormField
            control={form.control}
            name="contact_info"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact Info</FormLabel>
                <FormControl>
                  <Input placeholder="e.g. 999-333-2234" {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Add a phone number or an email address for the
                  customer.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="e.g. Two boxes of squash" {...field} />
                </FormControl>
                <FormDescription>
                  Optional: Add the contents of the fulfillment for later
                  reference.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit">Update stop</Button>
      </form>
    </Form>
  );
};
