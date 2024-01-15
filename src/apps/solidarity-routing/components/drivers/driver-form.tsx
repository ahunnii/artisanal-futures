import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { uniqueId } from "lodash";
import { Plus, Trash } from "lucide-react";
import { useMemo, type FC } from "react";

import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";

import { Controller, useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "~/components/ui/button";

import * as Form from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { useDrivers } from "~/apps/solidarity-routing/hooks/use-drivers";
import { ScrollArea } from "~/components/ui/scroll-area";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import { parseDataFromDriver } from "~/utils/routing/data-formatting";
import { cn } from "~/utils/styles";
import type { Coordinates } from "../../types";

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
  max_travel_time: z.coerce.number().min(0),
  max_stops: z.coerce.number().min(0),
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

const DriverForm: FC<TDriverForm> = ({ handleOnOpenChange }) => {
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
        time_windows: [{ startTime: "09:00", endTime: "17:00" }],
        service: 30,
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

  const handleAutoComplete = (
    address: string,
    onChange: (value: string) => void
  ) => {
    if (!address) return;

    onChange(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]!))
      .then(({ lat, lng }) => {
        console.log("Successfully got latitude and longitude", {
          latitude: lat,
          longitude: lng,
        });
        form.setValue("coordinates", {
          latitude: lat,
          longitude: lng,
        });
      })
      .catch((err) => console.error("Error", err));
  };

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
    <Form.Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full w-full flex-col space-y-8 md:h-[calc(100vh-15vh)] lg:flex-grow"
      >
        <ScrollArea className=" h-full w-full flex-1  max-md:max-h-[60vh]">
          <div className="space-y-4 p-4">
            <Form.FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <Form.FormItem className="w-full">
                  <Form.FormLabel>Driver&apos;s Name</Form.FormLabel>
                  <Form.FormControl>
                    <Input placeholder="Your driver's name" {...field} />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />

            {isLoaded && (
              <Controller
                name="address"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <Form.FormItem>
                    <Form.FormLabel>Starting Address</Form.FormLabel>

                    <GooglePlacesAutocomplete
                      selectProps={{
                        defaultInputValue: value,
                        onChange: (e) => handleAutoComplete(e!.label, onChange),
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

                    <Form.FormDescription>
                      This is the address where the driver will deliver the
                      package. Coordinates are <br /> Lat:{" "}
                      {form.watch("coordinates")?.latitude ?? 0} &nbsp; Lng:{" "}
                      {form.watch("coordinates")?.longitude ?? 0}
                    </Form.FormDescription>
                    <Form.FormMessage />
                  </Form.FormItem>
                )}
              />
            )}
            <div className="flex gap-4">
              <Form.FormField
                control={form.control}
                name="max_travel_time"
                render={({ field }) => (
                  <Form.FormItem>
                    <Form.FormLabel>Max Travel Time</Form.FormLabel>
                    <Form.FormControl>
                      <Input placeholder="e.g. 30" {...field} type="number" />
                    </Form.FormControl>
                    <Form.FormDescription>
                      How long should the fulfillment take? (in minutes)
                    </Form.FormDescription>
                    <Form.FormMessage />
                  </Form.FormItem>
                )}
              />{" "}
              <Form.FormField
                control={form.control}
                name="max_stops"
                render={({ field }) => (
                  <Form.FormItem>
                    <Form.FormLabel>Max Stops</Form.FormLabel>
                    <Form.FormControl>
                      <Input placeholder="e.g. 30" {...field} type="number" />
                    </Form.FormControl>
                    <Form.FormDescription>
                      On a scale of 0 - 100, with 100 being the highest
                      priority, how important is this stop?
                    </Form.FormDescription>
                    <Form.FormMessage />
                  </Form.FormItem>
                )}
              />
            </div>
            <Form.FormItem className="py-4">
              <Form.FormLabel className="text-lg">Driver Shift</Form.FormLabel>
              {/* <Form.FormDescription>
                When is the driver&apos;s shift?
              </Form.FormDescription> */}
              <div className="mt-5 flex items-center space-x-4">
                <Controller
                  render={({ field }) => (
                    <div className="flex grow flex-col">
                      <Form.FormLabel>Start Time</Form.FormLabel>{" "}
                      <Input {...field} placeholder="e.g. 40" type="time" />
                    </div>
                  )}
                  name={`time_window.startTime`}
                  control={form.control}
                />
                <Controller
                  render={({ field }) => (
                    <div className="flex grow flex-col">
                      <Form.FormLabel>End Time</Form.FormLabel>{" "}
                      <Input {...field} placeholder="e.g. 40" type="time" />
                    </div>
                  )}
                  name={`time_window.endTime`}
                  control={form.control}
                />
              </div>{" "}
              <Form.FormMessage />
            </Form.FormItem>

            <div className="my-4 flex flex-col border border-slate-200 bg-slate-50 p-4">
              <div className="flex justify-between">
                <Form.FormLabel className="text-lg">Break Slots</Form.FormLabel>

                <Button
                  onClick={() =>
                    append({
                      id: parseInt(uniqueId()),
                      service: 30,
                      time_windows: [{ startTime: "00:00", endTime: "00:00" }],
                    })
                  }
                  type="button"
                  size={"sm"}
                  className="flex space-x-1"
                >
                  <Plus className="h-4 w-4" /> <span>Add Break Slot</span>
                </Button>
              </div>
              {/* <div className="mt-5 flex max-h-96 flex-col space-y-4 overflow-y-auto border border-slate-200"> */}
              <ScrollArea className="relative my-2 h-72 flex-col shadow-inner">
                <>
                  {fields.map((item, index) => {
                    return (
                      <div
                        className={cn(
                          " flex flex-col space-y-2 px-4 py-2",
                          index % 2 === 0 ? "bg-slate-200" : ""
                        )}
                        key={item.id}
                      >
                        <div className="flex items-center justify-between border-b border-b-slate-500 py-2">
                          <h3 className="font-bold">Break {index + 1}</h3>
                          <Button
                            onClick={() => remove(index)}
                            variant="destructive"
                            className="space-x-1 text-xs"
                            type="button"
                            size={"sm"}
                          >
                            <Trash className="h-4 w-4" />{" "}
                            <span>Remove Break {index + 1}</span>
                          </Button>
                        </div>
                        <div className="space-y-4 pl-2">
                          <Controller
                            render={({ field }) => (
                              <Form.FormItem>
                                <Form.FormLabel>
                                  Break Duration (min)
                                </Form.FormLabel>
                                <Input
                                  {...field}
                                  type="number"
                                  placeholder="e.g. 40"
                                />
                                <Form.FormMessage />
                              </Form.FormItem>
                            )}
                            name={`break_slots.${index}.service`}
                            control={form.control}
                            defaultValue={Number(item.service)}
                          />
                          <Controller
                            render={({ field: { value } }) => (
                              <div className="space-y-4">
                                {value.map(
                                  (
                                    time_window: {
                                      startTime: string;
                                      endTime: string;
                                    },
                                    timeWindowIndex: number
                                  ) => (
                                    <>
                                      <Form.FormLabel>
                                        Time Windows
                                      </Form.FormLabel>
                                      <Form.FormMessage />
                                      <div
                                        key={timeWindowIndex}
                                        className=" flex flex-row items-end justify-between"
                                      >
                                        <div className="flex flex-col">
                                          <Form.FormLabel>
                                            Start Time
                                          </Form.FormLabel>
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
                                        </div>

                                        <div className="flex flex-col">
                                          <Form.FormLabel>
                                            End Time
                                          </Form.FormLabel>
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
                                        </div>

                                        <Button
                                          type="button"
                                          variant={"destructive"}
                                          onClick={() => {
                                            const time_windows = form.getValues(
                                              `break_slots.${index}.time_windows`
                                            );
                                            time_windows.splice(
                                              timeWindowIndex,
                                              1
                                            );
                                            form.setValue(
                                              `break_slots.${index}.time_windows`,
                                              time_windows
                                            );
                                          }}
                                        >
                                          <Trash />
                                        </Button>
                                      </div>

                                      <Form.FormDescription>
                                        Provide a list of times in which the
                                        driver can take their break.
                                      </Form.FormDescription>
                                    </>
                                  )
                                )}
                              </div>
                            )}
                            name={`break_slots.${index}.time_windows`}
                            control={form.control}
                          />

                          <div className="flex gap-4 py-2">
                            <Button
                              type="button"
                              className="flex-grow"
                              size={"sm"}
                              onClick={() =>
                                form.setValue(
                                  `break_slots.${index}.time_windows`,
                                  [
                                    ...form.getValues(
                                      `break_slots.${index}.time_windows`
                                    ),
                                    { startTime: "", endTime: "" },
                                  ]
                                )
                              }
                            >
                              Add Time Window
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </>
              </ScrollArea>
              <Form.FormDescription>
                Add a list of breaks that the driver can take. Indicating just
                the duration will assume anytime during the shift.
              </Form.FormDescription>{" "}
              <Form.FormMessage />
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
    </Form.Form>
  );
};

export default DriverForm;
