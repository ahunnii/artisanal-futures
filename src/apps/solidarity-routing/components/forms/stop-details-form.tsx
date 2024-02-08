import { useMemo, type FC } from "react";

import { useJsApiLoader } from "@react-google-maps/api";
import {
  default as GooglePlacesAutocomplete,
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { Controller, type UseFormReturn } from "react-hook-form";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";

import type { Driver, StopFormValues } from "../../types.wip";

import { DriverType, JobType } from "@prisma/client";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env.mjs";
import { cn } from "~/utils/styles";

type StopDetailsSectionProps = {
  form: UseFormReturn<StopFormValues>;
  // databaseDrivers?: Array<Driver>;
};

type Library = "places";
const libraries: Library[] = ["places"];

const StopDetailsSection: FC<StopDetailsSectionProps> = ({ form }) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
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
        form.setValue("address", {
          formatted: address,
          latitude: lat,
          longitude: lng,
        });
      })
      .catch((err) => console.error("Error", err));
  };

  const formErrors = form.formState.errors;
  const checkIfFormHasErrors = useMemo(() => {
    const keys = [
      "address.formatted",
      "prepTime",
      "serviceTime",
      "priority",
      "timeWindowStart",
      "timeWindowEnd",
      "type",
      "order",
      "notes",
    ];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <AccordionItem value="item-1" className="group">
      <AccordionTrigger
        className={cn("px-2 text-lg", checkIfFormHasErrors && "text-red-500")}
      >
        Stop Details
      </AccordionTrigger>
      <ScrollArea
        className={cn(
          "w-full transition-all duration-200 ease-in-out group-data-[state=closed]:h-[0vh] group-data-[state=closed]:opacity-0",
          "group-data-[state=open]:h-[35vh] group-data-[state=open]:opacity-100"
        )}
      >
        <AccordionContent className="px-2">
          <div className="flex flex-col space-y-4">
            <FormField
              control={form.control}
              name="prepTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Prep Time (Optional)
                  </FormLabel>
                  <FormControl>
                    <div className="relative ">
                      <Input
                        placeholder="e.g. 30"
                        className="block w-full rounded-md py-1.5 pr-12  text-gray-900     sm:text-sm sm:leading-6"
                        {...field}
                        type="number"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">min</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/75">
                    Any additional time needed before the stop?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="serviceTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Service Time
                  </FormLabel>
                  <FormControl>
                    <div className="relative ">
                      <Input
                        placeholder="e.g. 30"
                        className="block w-full rounded-md py-1.5 pr-12  text-gray-900     sm:text-sm sm:leading-6"
                        {...field}
                        type="number"
                      />
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 sm:text-sm">min</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/75">
                    How long should the stop take?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Priority
                  </FormLabel>
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
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="w-full">
              <FormLabel className="text-sm font-normal text-muted-foreground">
                Time Window
              </FormLabel>
              <div className="center mt-5 flex flex-col ">
                <Controller
                  render={({ field }) => (
                    <div className="flex grow items-center gap-2">
                      <FormLabel className="w-2/12">From </FormLabel>{" "}
                      <Input
                        {...field}
                        placeholder="e.g. 40"
                        type="time"
                        className="w-10/12"
                      />
                    </div>
                  )}
                  name={`timeWindowStart`}
                  control={form.control}
                />
                <Controller
                  render={({ field }) => (
                    <div className="flex grow items-center gap-2">
                      <FormLabel className="w-2/12">To </FormLabel>{" "}
                      <Input
                        {...field}
                        placeholder="e.g. 40"
                        type="time"
                        className="w-10/12"
                      />
                    </div>
                  )}
                  name={`timeWindowEnd`}
                  control={form.control}
                />
              </div>{" "}
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    {" "}
                    Stop Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a type</SelectLabel>
                          {Object.keys(JobType).map((job) => (
                            <SelectItem value={job} key={job}>
                              {job}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Order Details (Optional)
                  </FormLabel>
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
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          {/* <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Full Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your driver's name" {...field} />
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
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Home Address
                  </FormLabel>

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

                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Email
                </FormLabel>
                <FormControl>
                  <Input placeholder="e.g. test@test.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="order"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Order Details (Optional)
                </FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Notes (Optional)
                </FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
        </div> */}
        </AccordionContent>
      </ScrollArea>
    </AccordionItem>
  );
};

export default StopDetailsSection;
