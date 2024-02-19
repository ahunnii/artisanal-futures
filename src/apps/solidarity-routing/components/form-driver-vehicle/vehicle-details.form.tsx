import { useEffect, useMemo, useState, type FC } from "react";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { Home, Repeat, Undo } from "lucide-react";
import { Controller, type UseFormReturn } from "react-hook-form";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
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
import { Switch } from "~/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import type { DriverFormValues } from "~/apps/solidarity-routing/types.wip";
import { cn } from "~/utils/styles";

import { AutoCompleteDepotBtn } from "~/apps/solidarity-routing/components/shared";

type Props = { form: UseFormReturn<DriverFormValues> };

export const VehicleDetailsSection: FC<Props> = ({ form }) => {
  const { active: activeDriver } = useDriverVehicleBundles();

  const checkForRoundtripAddress =
    form.watch("endAddress.formatted") === "" ||
    form.watch("endAddress.formatted") === form.watch("startAddress.formatted");

  const [useDefault, setUseDefault] = useState(checkForRoundtripAddress);

  const [parent] = useAutoAnimate();

  const formErrors = form.formState.errors;

  useEffect(() => {
    if (useDefault) {
      form.setValue("endAddress", {
        formatted: "",
        latitude: undefined,
        longitude: undefined,
      });
    }
  }, [useDefault, form]);

  const checkIfFormHasErrors = useMemo(() => {
    const keys = [
      "startAddress.formatted",
      "endAddress.formatted",
      "maxTasks",
      "maxDistance",
      "maxTravelTime",
    ];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  const isVehicleRoundTrip =
    form.watch("endAddress.formatted") ===
      form.watch("startAddress.formatted") ||
    form.watch("endAddress.formatted") === "";

  const setStartLatLng = (lat: number, lng: number) => {
    form.setValue("startAddress.latitude", lat);
    form.setValue("startAddress.longitude", lng);
  };

  const setEndLatLng = (lat: number, lng: number) => {
    form.setValue("endAddress.latitude", lat);
    form.setValue("endAddress.longitude", lng);
  };
  return (
    <AccordionItem value="item-2" className="group">
      <AccordionTrigger
        className={cn("px-2 text-lg", checkIfFormHasErrors && "text-red-500")}
      >
        Vehicle Details
      </AccordionTrigger>
      <ScrollArea
        className={cn(
          "w-full transition-all duration-200 ease-in-out group-data-[state=closed]:h-[0vh] group-data-[state=closed]:opacity-0",
          "group-data-[state=open]:h-[35vh] group-data-[state=open]:opacity-100"
        )}
      >
        <AccordionContent className="px-2">
          <div className="flex flex-col gap-4">
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  {isVehicleRoundTrip ? "Roundtrip" : "Start / End"}
                </FormLabel>

                <FormDescription>
                  {useDefault && (
                    <>
                      <span className="flex items-center gap-1">
                        <Repeat className="h-4 w-4" />
                        {form.watch("startAddress.formatted")}
                      </span>
                    </>
                  )}
                  {!useDefault && (
                    <div className="flex flex-col space-y-0.5">
                      <span className="flex items-center gap-1">
                        {" "}
                        <Home className="h-4 w-4" />{" "}
                        {form.watch("startAddress.formatted")}
                      </span>

                      <span className="flex items-center gap-1">
                        {form.watch("endAddress.formatted") !== "" && (
                          <>
                            <Home className="h-4 w-4" />
                            {form.watch("endAddress.formatted")}
                          </>
                        )}
                      </span>
                    </div>
                  )}
                </FormDescription>
                <FormDescription className="text-xs text-muted-foreground/75">
                  Defaults to the driver&apos;s address.{" "}
                  <span className="font-bold"> Turn off </span>to set a starting
                  and ending address
                </FormDescription>
              </div>
              <FormControl>
                <Switch checked={useDefault} onCheckedChange={setUseDefault} />
              </FormControl>
            </FormItem>
            <div ref={parent} className="flex flex-col gap-4">
              {!useDefault && (
                <Controller
                  name="startAddress.formatted"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Starting Address
                      </FormLabel>

                      <AutoCompleteDepotBtn<DriverFormValues>
                        value={value}
                        onChange={onChange}
                        form={form}
                        useDefault={useDefault}
                        formKey="startAddress"
                        onLatLngChange={setStartLatLng}
                      />

                      <FormDescription className="text-xs text-muted-foreground/75">
                        This is where the driver typically starts and stops
                        their route.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {!useDefault && (
                <Controller
                  name="endAddress.formatted"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Ending Address (optional)
                      </FormLabel>

                      <div className="flex gap-1">
                        <AutoCompleteDepotBtn<DriverFormValues>
                          value={value}
                          onChange={onChange}
                          form={form}
                          useDefault={useDefault}
                          formKey="endAddress"
                          onLatLngChange={setEndLatLng}
                        />
                        {!form.watch("endAddress.formatted") && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  size="icon"
                                  type="button"
                                  onClick={() => {
                                    onChange(
                                      activeDriver?.vehicle?.endAddress
                                        ?.formatted
                                    );
                                    form.setValue(
                                      "endAddress.latitude",
                                      activeDriver?.vehicle?.endAddress
                                        ?.latitude
                                    );
                                    form.setValue(
                                      "endAddress.longitude",
                                      activeDriver?.vehicle?.endAddress
                                        ?.longitude
                                    );
                                  }}
                                >
                                  <Undo className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>Undo end address change</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                      <FormDescription className="text-xs text-muted-foreground/75">
                        This is where the driver typically starts and stops
                        their route.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="maxTasks"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Max Stops
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
                        <span className="text-gray-500 sm:text-sm">stops</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/75">
                    How many stops can this driver make in one day max?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="maxTravelTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Max Travel Time
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
                    How long should they be on the road for max?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="maxDistance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Max Distance
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
                        <span className="text-gray-500 sm:text-sm">miles</span>
                      </div>
                    </div>
                  </FormControl>
                  <FormDescription className="text-xs text-muted-foreground/75">
                    What is the furthest max distance you want your driver to
                    travel?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </AccordionContent>{" "}
      </ScrollArea>
    </AccordionItem>
  );
};
