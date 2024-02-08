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

import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";
import { env } from "~/env.mjs";
import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { AutoCompleteJobBtn } from "./autocomplete-job-btn";

type ClientDetailsSectionProps = {
  form: UseFormReturn<StopFormValues>;
  // databaseDrivers?: Array<Driver>;
  editClient?: boolean;
};

type Library = "places";
const libraries: Library[] = ["places"];

const ClientDetailsSection: FC<ClientDetailsSectionProps> = ({
  form,
  editClient,
}) => {
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

  const jobBundles = useClientJobBundles();

  const isClientAssigned = form.watch("clientId") !== undefined;

  return (
    <AccordionItem value="item-2" className="group">
      <AccordionTrigger
        className={cn("px-2 text-lg", checkIfFormHasErrors && "text-red-500")}
      >
        Client Details
      </AccordionTrigger>

      <ScrollArea
        className={cn(
          "transition-all duration-200 ease-in-out group-data-[state=closed]:h-[0vh]  group-data-[state=closed]:opacity-0",
          "group-data-[state=open]:h-[35vh] group-data-[state=open]:opacity-100"
        )}
      >
        <AccordionContent className="px-2">
          {isClientAssigned && (
            <p className="mb-4 leading-7 [&:not(:first-child)]:mt-6">
              You can reassign a client to this job:
            </p>
          )}

          <FormField
            control={form.control}
            name="clientId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Client
                </FormLabel>
                <FormControl>
                  <Select
                    disabled={jobBundles?.clients?.length === 0}
                    onValueChange={(value) => {
                      field.onChange(value);
                      const client = jobBundles.getClientById(value);

                      if (client) {
                        form.setValue("name", client?.name);
                        form.setValue("phone", client?.phone);
                        form.setValue("email", client?.email);
                        form.setValue(
                          "clientAddress.formatted",
                          client?.address?.formatted
                        );
                        form.setValue(
                          "clientAddress.latitude",
                          client?.address?.latitude
                        );
                        form.setValue(
                          "clientAddress.longitude",
                          client?.address?.longitude
                        );
                      }
                    }}
                    defaultValue={field.value}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a client" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Select a client</SelectLabel>
                        {jobBundles?.clients?.map((client) => (
                          <SelectItem value={client.id} key={client.id}>
                            <span>{client.name}</span>:{" "}
                            <span className="text-xs text-muted-foreground">
                              {client?.address?.formatted}
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

          {/* (editClient && form.watch("clientId") !== "") || */}
          {/* Client Id needs to be null to have the thing appear regardless*/}
          {/* If client id is there, edit client needs to be enabled. */}
          <>
            {" "}
            {(form.watch("clientId") === undefined ||
              (editClient && form.watch("clientId") !== undefined)) &&
              !form.watch("name").includes("Job #") && (
                <div className="flex flex-col space-y-4 pt-4">
                  <Separator />
                  <p className="text-lg font-semibold leading-7 [&:not(:first-child)]:mt-6">
                    Edit {form.watch("name") ?? "client"}&apos;s details:
                  </p>
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
                      name="clientAddress.formatted"
                      control={form.control}
                      render={({ field: { onChange, value } }) => (
                        <FormItem>
                          <FormLabel className="text-sm font-normal text-muted-foreground">
                            Home Address
                          </FormLabel>

                          <AutoCompleteJobBtn
                            value={value}
                            onChange={onChange}
                            form={form}
                            // useDefault={useDefault}
                            formKey="clientAddress"
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
                </div>
              )}
          </>

          <p className="leading-7 [&:not(:first-child)]:mt-6">
            Or create a new one:
          </p>
          <Button
            className="flex gap-2"
            type="button"
            onClick={() => toast("TODO: Add new client modal")}
          >
            <UserPlus className="h-4 w-4" />
            Create a new client
          </Button>
        </AccordionContent>
      </ScrollArea>
    </AccordionItem>
  );
};

export default ClientDetailsSection;
