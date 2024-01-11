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
import { Textarea } from "~/components/ui/textarea";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import { parseDataFromStop } from "~/utils/routing/data-formatting";
import type { Coordinates } from "../../../../components/tools/routing/types";

type Library = "places";
const libraries: Library[] = ["places"];

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
  email: z.string().optional(),
  details: z.string().optional(),
});
type StopFormValues = z.infer<typeof stopFormSchema>;

type TStopForm = {
  handleOnOpenChange: (data: boolean) => void;
};

const StopForm: FC<TStopForm> = ({ handleOnOpenChange }) => {
  const {
    appendLocation,
    updateLocation,
    activeLocation,
    locations,
    setLocations,
  } = useStops((state) => state);

  const {
    name,
    address,
    duration,
    priorityValue,
    prep,
    fulfillmentTimeValues,
    latitude,
    longitude,
    email,
    details,
  } = useMemo(() => parseDataFromStop(activeLocation), [activeLocation]);

  const defaultValues: Partial<StopFormValues> = {
    id: activeLocation?.id ?? parseInt(uniqueId()),
    customer_name: name,
    address,
    time_windows: fulfillmentTimeValues ?? [
      { startTime: "09:00", endTime: "17:00" },
    ],
    coordinates: { latitude, longitude } as Coordinates,
    drop_off_duration: duration ?? 5,
    prep_time_duration: prep ?? 0,
    priority: priorityValue ?? 50,
    email,

    details,
  };

  const form = useForm<StopFormValues>({
    resolver: zodResolver(stopFormSchema),
    defaultValues,
  });

  function onSubmit(data: StopFormValues) {
    if (activeLocation) updateLocation(data.id, data);
    else appendLocation(data);

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
    name: "time_windows",
  });

  const onDelete = () => {
    const temp = locations.filter((loc) => loc.id !== activeLocation?.id);
    setLocations(temp);
    handleOnOpenChange(false);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full flex-col justify-between space-y-8  md:h-[calc(100vh-15vh)] lg:flex-grow"
      >
        <ScrollArea className="relative flex h-full  w-full flex-1  max-md:max-h-[60vh]">
          <div className=" w-full space-y-4">
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
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>

                    <GooglePlacesAutocomplete
                      selectProps={{
                        // inputValue: value,
                        placeholder: "Start typing an address",
                        defaultInputValue: value,
                        onChange: (e) => {
                          if (!e) return;

                          onChange(e.label);
                          geocodeByAddress(e.label)
                            .then((results) => getLatLng(results[0]!))
                            .then(({ lat, lng }) => {
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
                      Lat: {form.watch("coordinates")?.latitude ?? 0} &nbsp;
                      Lng: {form.watch("coordinates")?.longitude ?? 0}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex  flex-1 gap-4">
              <FormField
                control={form.control}
                name="prep_time_duration"
                render={({ field }) => (
                  <FormItem className="flex-1 ">
                    <FormLabel>Prep Time </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="minutes"
                        {...field}
                        type="number"
                        onChange={(e) => {
                          field.onChange(Number(e.target.value));
                        }}
                      />
                    </FormControl>
                    <FormDescription>
                      Max minutes to prep the order
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
                    <FormLabel>Duration</FormLabel>
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
                    <FormDescription>Max minutes at stop</FormDescription>
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
                      <Select
                        onValueChange={(e) => {
                          field.onChange(
                            e === "low" ? 0 : e === "mid" ? 50 : 100
                          );
                        }}
                        defaultValue={
                          field.value <= 33
                            ? "low"
                            : field.value <= 66
                            ? "mid"
                            : "high"
                        }
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="mid">Mid</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      This will prioritize the stop accordingly.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex flex-1 flex-col gap-4">
              <FormLabel>Fulfillment Windows</FormLabel>
              <ScrollArea className="flex max-h-40 flex-col px-4  md:max-h-40 lg:max-h-60">
                {fields.map((item, index) => (
                  <div
                    key={item.id}
                    className="my-2 flex items-center space-x-4"
                  >
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
              </ScrollArea>
              <FormDescription>
                Add a list of possible time windows in which the driver can
                fulfill the order.
              </FormDescription>{" "}
              <FormMessage />
              <Button
                onClick={() => append({ startTime: "00:00", endTime: "00:00" })}
                type="button"
              >
                Add Time Slot
              </Button>
            </div>
            <div className="flex flex-col space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. customer@gmail.com"
                        {...field}
                        type={"email"}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add an email address for the customer.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="details"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Details</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="e.g. Two boxes of squash"
                        className="resize-none"
                        // {...field}
                        onChange={field.onChange}
                        value={field.value}
                        aria-rowcount={3}
                      />
                    </FormControl>
                    <FormDescription>
                      Optional: Add some notes or details of the fulfillment for
                      later reference.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
            {activeLocation ? "Update" : "Add"} stop
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default StopForm;
