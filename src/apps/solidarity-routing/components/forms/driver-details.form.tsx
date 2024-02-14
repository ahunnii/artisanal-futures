import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useJsApiLoader } from "@react-google-maps/api";
import { useMemo, useState, type FC } from "react";
import {
  default as GooglePlacesAutocomplete,
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { Controller, type UseFormReturn } from "react-hook-form";
import { PatternFormat } from "react-number-format";

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

import type { Driver, DriverFormValues } from "../../types.wip";

import { DriverType } from "@prisma/client";
import { Home, Mail, Pencil, Phone, User } from "lucide-react";
import { Button } from "~/components/ui/button";
import { FormattedNumericInput } from "~/components/ui/formatted-numeric-input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { env } from "~/env.mjs";
import { cn } from "~/utils/styles";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { AutoCompleteBtn } from "./autocomplete-btn";

type DriverDetailsSectionProps = {
  form: UseFormReturn<DriverFormValues>;
  // databaseDrivers?: Array<Driver>;
};

function phoneFormat(input: string) {
  //returns (###) ###-####
  input = input.replace(/\D/g, "");
  const size = input.length;
  if (size > 0) {
    input = "(" + input;
  }
  if (size > 3) {
    input = input.slice(0, 4) + ") " + input.slice(4, 11);
  }
  if (size > 6) {
    input = input.slice(0, 9) + "-" + input.slice(9);
  }
  return input;
}

type Library = "places";
const libraries: Library[] = ["places"];

const DriverDetailsSection: FC<DriverDetailsSectionProps> = ({ form }) => {
  const [parent, enableAnimations] = useAutoAnimate(/* optional config */);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const formErrors = form.formState.errors;
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

  const checkIfFormHasErrors = useMemo(() => {
    const keys = ["name", "email", "phone", "type", "address.formatted"];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <>
      <AccordionItem value="item-1" className=" group ">
        <AccordionTrigger
          className={cn(
            " px-2 text-lg ",
            checkIfFormHasErrors && "text-red-500"
          )}
        >
          Driver Details
        </AccordionTrigger>
        <ScrollArea
          className={cn(
            "w-full transition-all duration-200 ease-in-out group-data-[state=closed]:h-[0vh] group-data-[state=closed]:opacity-0",
            "group-data-[state=open]:h-[35vh] group-data-[state=open]:opacity-100"
          )}
        >
          <AccordionContent className="px-2 ">
            <div className="flex flex-col space-y-4">
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
                        Default Address
                      </FormLabel>
                      <AutoCompleteBtn
                        value={value}
                        onChange={onChange}
                        form={form}
                        key="address"
                      />

                      {/* <GooglePlacesAutocomplete
                        selectProps={{
                          defaultInputValue: value,
                          onChange: (e) =>
                            handleAutoComplete(e!.label, onChange),
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
                      /> */}

                      <FormDescription className="text-xs text-muted-foreground/75">
                        This is where the driver typically starts and stops
                        their route.
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
                name="phone"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-normal text-muted-foreground">
                      Phone
                    </FormLabel>
                    <FormControl>
                      <FormattedNumericInput
                        {...field}
                        type="tel"
                        allowEmptyFormatting
                        format="+1 (###) ###-####"
                        mask="_"
                        onChange={(e) => {
                          e.preventDefault();
                        }}
                        onValueChange={(value) => {
                          console.log(form.watch("phone"));
                          console.log(
                            /^\d{10}$/.test(`${form.watch("phone")}`)
                          );
                          console.log(form.watch("phone"));
                          console.log(/^\d{10}$/.test(`${value.floatValue}`));
                          field.onChange(`${value.floatValue}`);
                        }}
                        required
                      />
                      {/* 
           <Input
             placeholder="ex. 333-334-2233"
             {...field}
             onChange={(e) => {
               const value = phoneFormat(e.target.value);

               field.onChange(value);
             }}
           /> */}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel className="text-sm font-normal text-muted-foreground">
                      {" "}
                      Driver Type
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a driver" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectLabel>Select a type</SelectLabel>
                            {Object.keys(DriverType).map((driver) => (
                              <SelectItem value={driver} key={driver}>
                                {driver}
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
            </div>
          </AccordionContent>
        </ScrollArea>
      </AccordionItem>
    </>
  );
};

export default DriverDetailsSection;
