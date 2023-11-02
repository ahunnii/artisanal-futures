import { zodResolver } from "@hookform/resolvers/zod";
import { useJsApiLoader } from "@react-google-maps/api";
import { uniqueId } from "lodash";
import { Trash } from "lucide-react";
import type { FC } from "react";

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

import { toast as notify } from "react-hot-toast";
import { toast } from "~/components/ui/use-toast";
import { env } from "~/env.mjs";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { api } from "~/utils/api";
import type { Driver } from "../types";

const driverFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Name must be at least 2 characters.",
    })
    .max(30, {
      message: "Name must not be longer than 30 characters.",
    }),

  email: z.string().email(),
  phone: z.string().optional(),
});

type DriverFormValues = z.infer<typeof driverFormSchema>;

// This can come from your database or API.

interface IProps {
  callback: () => void;
}

export const DriverInitForm: FC<IProps> = ({ callback }) => {
  const defaultValues: Partial<DriverFormValues> = {
    name: "",
  };

  const form = useForm<DriverFormValues>({
    resolver: zodResolver(driverFormSchema),
    defaultValues,
  });

  function onSubmit(data: DriverFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
    mutate(data);
  }

  const { mutate } = api.driver.createDriver.useMutation({
    onSuccess: () => {
      notify.success("Driver added to depot.");
      callback();
    },
    onError: (error) => {
      notify.error("Something went wrong with adding your driver.");
      console.error(error);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className=" flex h-full flex-grow flex-col justify-between space-y-8"
      >
        <div className=" flex  flex-col  space-y-8">
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

          <div className="flex gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. test@gmail.com"
                      {...field}
                      type="email"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g. 999-986-7777"
                      {...field}
                      type="phone"
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <Button
          type="submit"
          onClick={() => console.log(form.formState.errors)}
        >
          Add driver to depot
        </Button>
      </form>
    </Form>
  );
};
