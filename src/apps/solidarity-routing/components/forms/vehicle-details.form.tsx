import type { FC } from "react";

import { type UseFormReturn } from "react-hook-form";

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

import type { DriverFormValues } from "../../types.wip";

type DriverDetailsSectionProps = {
  form: UseFormReturn<DriverFormValues>;
};

const VehicleDetailsSection: FC<DriverDetailsSectionProps> = ({ form }) => {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="px-2 text-lg">
        Vehicle Details
      </AccordionTrigger>

      <AccordionContent className="px-2">
        <div className="flex flex-col gap-4">
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
      </AccordionContent>
    </AccordionItem>
  );
};

export default VehicleDetailsSection;
