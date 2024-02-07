import type { FC } from "react";

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

import { env } from "~/env.mjs";
import type { DepotFormValues } from "../depot/depot-form.wip";

type DriverDetailsSectionProps = {
  form: UseFormReturn<DepotFormValues>; // databaseDrivers?: Array<Driver>;
};

type Library = "places";
const libraries: Library[] = ["places"];

const DepotDetailsForm: FC<DriverDetailsSectionProps> = ({ form }) => {
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

  return (
    <AccordionItem value="item-1">
      <AccordionTrigger className="px-2 text-lg">
        Depot Details
      </AccordionTrigger>

      <AccordionContent className="px-2">
        <div className="flex flex-col space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="Your depot's name" {...field} />
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
                    Address
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

                  <FormDescription className="text-xs text-muted-foreground/75">
                    Drivers will default to this address unless specified.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default DepotDetailsForm;
