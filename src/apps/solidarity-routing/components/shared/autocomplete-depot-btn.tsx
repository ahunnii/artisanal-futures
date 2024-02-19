import { useState } from "react";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormReturn,
} from "react-hook-form";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useJsApiLoader } from "@react-google-maps/api";
import { env } from "~/env.mjs";

interface IProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  formKey: string;
  onChange: (value: string) => void;
  onLatLngChange: (lat: number, lng: number) => void;
  value: string | undefined;
  useDefault?: boolean;
}

type Library = "places";
const libraries: Library[] = ["places"];

export function AutoCompleteDepotBtn<T extends FieldValues>({
  value,
  onChange,
  onLatLngChange,
  form,
  useDefault,
  formKey,
}: IProps<T>) {
  const [open, setOpen] = useState(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-autocomplete-strict",
    googleMapsApiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
    libraries,
  });

  const handleAutoComplete = (address: string) => {
    if (!address || useDefault) return;

    onChange(address);
    geocodeByAddress(address)
      .then((results) => getLatLng(results[0]!))
      .then(({ lat, lng }) => {
        form.setValue(
          `${formKey}.formatted` as Path<T>,
          address as PathValue<T, Path<T>>
        );
        onLatLngChange(lat, lng);
        form.setValue(
          `${formKey}.latitude` as Path<T>,
          lat as PathValue<T, Path<T>>
        );
        form.setValue(
          `${formKey}.longitude` as Path<T>,
          lng as PathValue<T, Path<T>>
        );
      })
      .catch((err) => console.error("Error", err))
      .finally(() => setOpen(false));
  };

  if (!isLoaded) return null;
  return (
    <>
      {isLoaded && (
        <Dialog onOpenChange={setOpen} open={open}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              type="button"
              className="relative w-full justify-start font-normal"
            >
              <p className="absolute w-10/12 overflow-hidden text-ellipsis whitespace-nowrap text-left">
                {" "}
                {value}
              </p>

              <MagnifyingGlassIcon className="ml-auto h-5 w-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Enter Address</DialogTitle>
              <DialogDescription>
                Start typing to find an address
              </DialogDescription>
            </DialogHeader>
            <GooglePlacesAutocomplete
              selectProps={{
                defaultInputValue:
                  value === ""
                    ? form.watch("address.formatted" as Path<T>)
                    : value,
                onChange: (e) => handleAutoComplete(e!.label),
                classNames: {
                  control: (state) =>
                    state.isFocused ? "border-red-600" : "border-grey-300",
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
            <DialogFooter></DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
