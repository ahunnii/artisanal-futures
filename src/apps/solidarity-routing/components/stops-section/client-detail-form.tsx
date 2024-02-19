import { useMemo, type FC } from "react";

import { Controller, type UseFormReturn } from "react-hook-form";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import {
  FormControl,
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

import type { StopFormValues } from "../../types.wip";

import { UserPlus } from "lucide-react";
import toast from "react-hot-toast";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Textarea } from "~/components/ui/textarea";

import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { AutoCompleteDepotBtn } from "../shared/autocomplete-depot-btn";

type ClientDetailsSectionProps = {
  form: UseFormReturn<StopFormValues>;
  // databaseDrivers?: Array<Driver>;
  editClient?: boolean;
};

const ClientDetailsSection: FC<ClientDetailsSectionProps> = ({
  form,
  editClient,
}) => {
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
                      const bundle = jobBundles.getClientById(value);

                      if (bundle?.client) {
                        form.setValue("name", bundle?.client?.name);
                        form.setValue("phone", bundle?.client?.phone);
                        form.setValue("email", bundle?.client?.email);
                        form.setValue(
                          "clientAddress.formatted",
                          bundle?.client?.address?.formatted
                        );
                        form.setValue(
                          "clientAddress.latitude",
                          bundle?.client?.address?.latitude
                        );
                        form.setValue(
                          "clientAddress.longitude",
                          bundle?.client?.address?.longitude
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

          <>
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

                  <Controller
                    name="clientAddress.formatted"
                    control={form.control}
                    render={({ field: { onChange, value } }) => (
                      <FormItem>
                        <FormLabel className="text-sm font-normal text-muted-foreground">
                          Home Address
                        </FormLabel>

                        <AutoCompleteDepotBtn<StopFormValues>
                          value={value}
                          onChange={onChange}
                          form={form}
                          onLatLngChange={(lat, lng) => {
                            form.setValue("clientAddress.latitude", lat);
                            form.setValue("clientAddress.longitude", lng);
                          }}
                          formKey="clientAddress"
                        />

                        <FormMessage />
                      </FormItem>
                    )}
                  />

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
