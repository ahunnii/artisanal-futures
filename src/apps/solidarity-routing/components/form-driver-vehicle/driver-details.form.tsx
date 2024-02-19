import { useMemo, type FC } from "react";

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
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";

import { AutoCompleteDepotBtn } from "~/apps/solidarity-routing/components/shared";

import type { DriverFormValues } from "~/apps/solidarity-routing/types.wip";

import { DriverType } from "@prisma/client";

import { FormattedNumericInput } from "~/components/ui/formatted-numeric-input";

import { cn } from "~/utils/styles";

type Props = {
  form: UseFormReturn<DriverFormValues>;
};

export const DriverDetailsSection: FC<Props> = ({ form }) => {
  const formErrors = form.formState.errors;

  const checkIfFormHasErrors = useMemo(() => {
    const keys = ["name", "email", "phone", "type", "address.formatted"];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  const setLatLng = (lat: number, lng: number) => {
    form.setValue("address.latitude", lat);
    form.setValue("address.longitude", lng);
  };

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

              <Controller
                name="address.formatted"
                control={form.control}
                render={({ field: { onChange, value } }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-normal text-muted-foreground">
                      Default Address
                    </FormLabel>
                    <AutoCompleteDepotBtn<DriverFormValues>
                      value={value}
                      onChange={onChange}
                      onLatLngChange={setLatLng}
                      form={form}
                      formKey="address"
                    />

                    <FormDescription className="text-xs text-muted-foreground/75">
                      This is where the driver typically starts and stops their
                      route.
                    </FormDescription>
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
                          field.onChange(`${value.floatValue}`);
                        }}
                        required
                      />
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
