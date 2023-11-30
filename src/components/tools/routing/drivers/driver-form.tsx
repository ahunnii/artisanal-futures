import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import { useMemo, type FC } from "react";

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

import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { parseDataFromDriver } from "~/utils/routing/data-formatting";
import type { Coordinates } from "../types";

type Library = "places";
const libraries: Library[] = ["places"];

const driverFormSchema = z.object({
  id: z.number(),
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),

  address: z.string(),
  max_travel_time: z.number().min(0),
  max_stops: z.number().min(0),
  break_slots: z.array(
    z.object({
      id: z.number(),
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
      service: z.coerce.number().min(0),
    })
  ),
  time_window: z.object({
    startTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Time must be in HH:MM format.",
    }),
    endTime: z.string().regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, {
      message: "Invalid time format. Time must be in HH:MM format.",
    }),
  }),
  coordinates: z.object({
    latitude: z.number(),
    longitude: z.number(),
  }),
});
type DriverFormValues = z.infer<typeof driverFormSchema>;

type TDriverForm = {
  handleOnOpenChange: (data: boolean) => void;
};

export const DriverForm: FC<TDriverForm> = ({ handleOnOpenChange }) => {
  const { appendDriver, updateDriver, activeDriver, drivers, setDrivers } =
    useDrivers((state) => state);

  const {
    name,
    address,
    shiftValues,
    breaks,
    maxTravel,
    maxStops,
    latitude,
    longitude,
  } = useMemo(() => parseDataFromDriver(activeDriver), [activeDriver]);

  const defaultValues: Partial<DriverFormValues> = {
    id: activeDriver?.id ?? parseInt(uniqueId()),
    name,
    address,
    time_window: shiftValues ?? { startTime: "09:00", endTime: "17:00" },
    break_slots: breaks ?? [
      {
        id: parseInt(uniqueId()),
        time_windows: [{ startTime: "00:00", endTime: "00:00" }],
        service: 0,
      },
    ],
    coordinates: { latitude, longitude } as Coordinates,
    max_travel_time: maxTravel,
    max_stops: maxStops,
  };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues,
  });

  function onSubmit(data: DriverFormValues) {
    if (activeDriver) updateDriver(data.id, data);
    else appendDriver(data);

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

  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "break_slots",
  });

  const onDelete = () => {
    const temp = drivers.filter((loc) => loc.id !== activeDriver?.id);
    setDrivers(temp);
    handleOnOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full flex-col justify-between space-y-8  lg:flex-grow"
      >
        <ScrollArea className="relative flex h-full  w-full flex-1  max-md:max-h-[60vh]">
          <div className=" flex  w-full  flex-col space-y-4">
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
            <div className="flex gap-4">
              <FormField
                control={form.control}
                name="max_travel_time"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Travel Time</FormLabel>
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
                name="max_stops"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Stops</FormLabel>
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
                      On a scale of 0 - 100, with 100 being the highest
                      priority, how important is this stop?
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormItem>
              <FormLabel className="text-lg">Time Window</FormLabel>
              <div className="mt-5 flex items-center gap-4 space-y-4">
                <Controller
                  render={({ field }) => (
                    <div className="flex grow flex-col">
                      <FormLabel>Start Time</FormLabel>{" "}
                      <Input {...field} placeholder="e.g. 40" type="time" />
                    </div>
                  )}
                  name={`time_window.startTime`}
                  control={form.control}
                />
                <Controller
                  render={({ field }) => (
                    <div className="flex grow flex-col">
                      <FormLabel>End Time</FormLabel>{" "}
                      <Input {...field} placeholder="e.g. 40" type="time" />
                    </div>
                  )}
                  name={`time_window.endTime`}
                  control={form.control}
                />
              </div>{" "}
              <FormDescription>
                When is the driver&apos;s shift?
              </FormDescription>
              <FormMessage />
            </FormItem>
            <div>
              <FormLabel className="text-lg">Break Slots</FormLabel>
              <div className="mt-5 flex max-h-96 flex-col space-y-4 overflow-y-auto">
                {fields.map((item, index) => {
                  return (
                    <div
                      className="my-1 flex flex-col space-y-2 "
                      key={item.id}
                    >
                      <Controller
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Break Duration</FormLabel>
                            <Input
                              {...field}
                              type="number"
                              placeholder="e.g. 40"
                              onChange={(e) => {
                                field.onChange(Number(e.target.value));
                              }}
                            />
                            <FormMessage />
                            <FormDescription>
                              How long should the break be? (In minutes)
                            </FormDescription>
                          </FormItem>
                        )}
                        name={`break_slots.${index}.service`}
                        control={form.control}
                        defaultValue={Number(item.service)}
                      />
                      <Controller
                        render={({ field: { value } }) => (
                          <>
                            {value.map(
                              (
                                time_window: {
                                  startTime: string;
                                  endTime: string;
                                },
                                timeWindowIndex: number
                              ) => (
                                <>
                                  <FormLabel>Time Windows</FormLabel>
                                  <FormMessage />
                                  <div
                                    key={timeWindowIndex}
                                    className="my-1 flex flex-row items-center gap-4"
                                  >
                                    <FormLabel>Start Time</FormLabel>
                                    <Input
                                      {...form.register(
                                        `break_slots.${index}.time_windows.${timeWindowIndex}.startTime`
                                      )}
                                      placeholder="Start Time (HH:mm)"
                                      onChange={(e) => {
                                        form.setValue(
                                          `break_slots.${index}.time_windows.${timeWindowIndex}.startTime`,
                                          e.target.value
                                        );
                                      }}
                                      defaultValue={time_window.startTime}
                                      type="time"
                                    />

                                    <FormLabel>End Time</FormLabel>
                                    <Input
                                      {...form.register(
                                        `break_slots.${index}.time_windows.${timeWindowIndex}.endTime`
                                      )}
                                      placeholder="End Time (HH:mm)"
                                      onChange={(e) => {
                                        // onChange(e);
                                        form.setValue(
                                          `break_slots.${index}.time_windows.${timeWindowIndex}.endTime`,
                                          e.target.value
                                        );
                                      }}
                                      defaultValue={time_window.endTime}
                                      type="time"
                                    />

                                    <Button
                                      type="button"
                                      variant={"destructive"}
                                      onClick={() => {
                                        const time_windows = form.getValues(
                                          `break_slots.${index}.time_windows`
                                        );
                                        time_windows.splice(timeWindowIndex, 1);
                                        form.setValue(
                                          `break_slots.${index}.time_windows`,
                                          time_windows
                                        );
                                      }}
                                    >
                                      <Trash />
                                    </Button>
                                  </div>

                                  <FormDescription>
                                    Provide a list of times in which the driver
                                    can take their break.
                                  </FormDescription>
                                </>
                              )
                            )}
                          </>
                        )}
                        name={`break_slots.${index}.time_windows`}
                        control={form.control}
                      />

                      <div className="flex gap-4 py-2">
                        <Button
                          type="button"
                          className="flex-grow"
                          onClick={() =>
                            form.setValue(`break_slots.${index}.time_windows`, [
                              ...form.getValues(
                                `break_slots.${index}.time_windows`
                              ),
                              { startTime: "", endTime: "" },
                            ])
                          }
                        >
                          Add Time Window
                        </Button>

                        <Button
                          onClick={() => remove(index)}
                          variant="destructive"
                          className="flex-grow"
                          type="button"
                        >
                          <Trash /> Remove Break Slot
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <FormDescription>
                Add a list of time windows for this stop that the delivery
                driver can arrive at.
              </FormDescription>{" "}
              <FormMessage />
              <Button
                onClick={() =>
                  append({
                    id: parseInt(uniqueId()),
                    service: 30,
                    time_windows: [{ startTime: "00:00", endTime: "00:00" }],
                  })
                }
                type="button"
              >
                Add Break Slot
              </Button>
            </div>
          </div>
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
