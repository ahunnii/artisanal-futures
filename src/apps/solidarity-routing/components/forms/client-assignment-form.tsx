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

import { DriverType } from "@prisma/client";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env.mjs";
import { cn } from "~/utils/styles";
import { AutoCompleteJobBtn } from "./autocomplete-job-btn";

type ClientDetailsSectionProps = {
  form: UseFormReturn<StopFormValues>;
  // databaseDrivers?: Array<Driver>;
};

type Library = "places";
const libraries: Library[] = ["places"];

const ClientDetailsSection: FC<ClientDetailsSectionProps> = ({ form }) => {
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
    const keys = ["clientAddress.formatted", "name", "email", "phone", "notes"];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  return (
    <AccordionItem value="item-2">
      <AccordionTrigger
        className={cn("px-2 text-lg", checkIfFormHasErrors && "text-red-500")}
      >
        Assign Client
      </AccordionTrigger>

      <ScrollArea
        className={cn(
          "w-full transition-all duration-200 ease-in-out group-data-[state=closed]:h-[0vh] group-data-[state=closed]:opacity-0",
          "group-data-[state=open]:h-[35vh] group-data-[state=open]:opacity-100"
        )}
      >
        <AccordionContent className="px-2">
      
         <p className="leading-7 [&:not(:first-child)]:mt-6">Select a client (optional)</p>

        <FormField
          control={form.control}
          name="id"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel> Driver</FormLabel>
              <FormControl>
                <Select
                  disabled={databaseDrivers?.length === 0}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Select a driver</SelectLabel>
                      {databaseDrivers?.map((driver) => (
                        <SelectItem value={driver.id} key={driver.id}>
                          <span>{driver.name}</span>:{" "}
                          <span className="text-xs text-muted-foreground">
                            {driver?.address?.formatted}
                          </span>
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

        <Separator className="my-4" />

        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Or create a temporary one:
        </p> */}

        </AccordionContent>
      </ScrollArea>
    </AccordionItem>
  );
};

export default ClientDetailsSection;
