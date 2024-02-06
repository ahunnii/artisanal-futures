import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import { useMemo, useState, type FC } from "react";

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

import { useStopsStore } from "~/apps/solidarity-routing/hooks/use-stops-store";
import type { Coordinates } from "~/apps/solidarity-routing/types";
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

import { useSession } from "next-auth/react";
import { AlertModal } from "~/apps/admin/components/modals/alert-modal";
import { Accordion } from "~/components/ui/accordion";
import { StopFormValues, stopFormSchema } from "../../types.wip";
import {
  secondsToMinutes,
  unixSecondsToMilitaryTime,
} from "../../utils/generic/format-utils.wip";
import ClientDetailsSection from "../forms/client-detail-form";
import StopDetailsSection from "../forms/stop-details-form";

type Library = "places";
const libraries: Library[] = ["places"];

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
  } = useStopsStore((state) => state);

  const [open, setOpen] = useState(false);
  const { status } = useSession();
  const [loading, setLoading] = useState(false);

  const defaultValues: Partial<StopFormValues> = {
    id: activeLocation?.job.id ?? uniqueId("job_"),
    type: activeLocation?.job.type ?? "DELIVERY",
    name: activeLocation?.client.name ?? "",
    address: {
      formatted: activeLocation?.job.address.formatted ?? undefined,
      latitude: activeLocation?.job.address.latitude ?? undefined,
      longitude: activeLocation?.job.address.longitude ?? undefined,
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
    email: activeLocation?.client.email ?? "",
    order: activeLocation?.job.order ?? "",
    notes: activeLocation?.job.notes ?? "",
  };

  const form = useForm<StopFormValues>({
    resolver: zodResolver(stopFormSchema),
    defaultValues,
  });

  function onSubmit(data: StopFormValues) {
    // if (activeLocation) updateLocation(data.id, data);
    // else appendLocation(data);

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

  const onDelete = () => {
    const temp = locations.filter(
      (loc) => loc.job.id !== activeLocation?.job.id
    );
    setLocations(temp);
    handleOnOpenChange(false);
  };

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
        form.setValue("address", {
          formatted: address,
          latitude: lat,
          longitude: lng,
        });
      })
      .catch((err) => console.error("Error", err));
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
          className=" flex h-full flex-col justify-between space-y-8  md:h-[calc(100vh-15vh)] lg:flex-grow"
        >
          {activeLocation && (
            <div className="flex w-full flex-col  gap-3  border-b bg-white p-4">
              <div className="flex items-center justify-between gap-3">
                <Button
                  type="button"
                  size="icon"
                  variant={"destructive"}
                  onClick={() => setOpen(true)}
                >
                  <Trash className="h-4 w-4" />
                  <span className="sr-only">Delete</span>
                </Button>

                {status === "authenticated" && (
                  <Button type="submit" className="flex-1" variant={"outline"}>
                    {activeLocation ? "Set as client default" : "Save and add"}
                  </Button>
                )}

                <Button type="submit" className="flex-1">
                  {activeLocation ? "Update" : "Add"} stop
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

          <ScrollArea className="relative flex h-full  w-full flex-1  max-md:max-h-[60vh]">
            <Accordion
              type="single"
              collapsible
              className="w-full px-4"
              defaultValue="item-1"
            >
              <StopDetailsSection form={form} />
              <ClientDetailsSection form={form} />
            </Accordion>

            {/* <div className=" w-full space-y-4">
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
                name="address.formatted"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>

                    <GooglePlacesAutocomplete
                      selectProps={{
                        defaultInputValue: value,
                        placeholder: "Start typing an address",
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

                    <FormDescription>
                      {form.watch("address.latitude") ?? 0} &nbsp; Lng:{" "}
                      {form.watch("address.longitude") ?? 0}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex  flex-1 gap-4">
              <FormField
                control={form.control}
                name="prepTime"
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
                name="serviceTime"
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
              <FormLabel>Fulfillment Window</FormLabel>
              <Controller
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Attribute (e.g., Size, Color)"
                    type="time"
                  />
                )}
                name={`timeWindowStart`}
                control={form.control}
              />
              <Controller
                render={({ field }) => (
                  <Input
                    {...field}
                    placeholder="Value (e.g., M, Red)"
                    type="time"
                  />
                )}
                name={`timeWindowEnd`}
                control={form.control}
              />
              <FormDescription>
                Add a list of possible time windows in which the driver can
                fulfill the order.
              </FormDescription>{" "}
              <FormMessage />
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g. 999-999-9999"
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
                name="notes"
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
              />{" "}
              <FormField
                control={form.control}
                name="order"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Stop Order</FormLabel>
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
          </div> */}
          </ScrollArea>
          <div className="mt-auto flex gap-4 ">
            {/* <Button
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
            </Button> */}
          </div>
        </form>
      </Form>
    </>
  );
};

export default StopForm;
