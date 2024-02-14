import { useMemo, useState, type FC } from "react";

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

import type { StopFormValues } from "../../types.wip";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { JobType } from "@prisma/client";
import { Home, Package, Undo } from "lucide-react";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";

import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { AutoCompleteJobBtn } from "./autocomplete-job-btn";

type StopDetailsSectionProps = {
  form: UseFormReturn<StopFormValues>;
  // databaseDrivers?: Array<Driver>;
};

const StopDetailsSection: FC<StopDetailsSectionProps> = ({ form }) => {
  const [useDefault, setUseDefault] = useState(
    form.getValues("address.formatted") === "" ? false : true
  );

  const jobBundles = useClientJobBundles();

  const formErrors = form.formState.errors;
  const checkIfFormHasErrors = useMemo(() => {
    const keys = [
      "address.formatted",
      "prepTime",
      "serviceTime",
      "priority",
      "timeWindowStart",
      "timeWindowEnd",
      "type",
      "order",
      "notes",
    ];

    const hasErrors = keys.some(
      (key) => formErrors[key as keyof typeof formErrors]
    );
    return hasErrors;
  }, [formErrors]);

  const { active: activeJob } = useClientJobBundles();

  const [parent] = useAutoAnimate(/* optional config */);
  return (
    <AccordionItem value="item-1" className="group">
      <AccordionTrigger
        className={cn("px-2 text-lg", checkIfFormHasErrors && "text-red-500")}
      >
        Stop Details
      </AccordionTrigger>
      <ScrollArea
        className={cn(
          "w-full transition-all duration-200 ease-in-out group-data-[state=closed]:h-[0vh] group-data-[state=closed]:opacity-0",
          "group-data-[state=open]:h-[35vh] group-data-[state=open]:opacity-100"
        )}
      >
        <AccordionContent className="px-2">
          <div className="flex flex-col space-y-4">
            {jobBundles.active && (
              <FormItem className="my-2 flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Address</FormLabel>

                  <FormDescription>
                    <>
                      <span className="flex items-center gap-1">
                        <Package className="h-4 w-4" />
                        {form.watch("address.formatted")}
                      </span>
                    </>
                  </FormDescription>
                  <FormDescription className="text-xs text-muted-foreground/75">
                    Switch to change the address for this stop.
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={useDefault}
                    onCheckedChange={(e: boolean) => {
                      // enableAnimations(e);
                      setUseDefault(e);
                    }}
                  />
                </FormControl>
              </FormItem>
            )}
            <div ref={parent} className="flex flex-col gap-4">
              {!useDefault && (
                <Controller
                  name="address.formatted"
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <FormItem>
                      <FormLabel className="text-sm font-normal text-muted-foreground">
                        Job Address
                      </FormLabel>

                      <div className="flex gap-1">
                        <AutoCompleteJobBtn
                          value={value}
                          onChange={onChange}
                          form={form}
                          useDefault={useDefault}
                          formKey="address"
                        />
                        {/* {!form.watch("address.formatted") &&
                          jobs?.active?.client?.address && ( */}
                        <>
                          {activeJob?.job?.address && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    type="button"
                                    onClick={() => {
                                      onChange(
                                        activeJob?.job?.address?.formatted
                                      );
                                      form.setValue(
                                        "address.latitude",
                                        activeJob?.job?.address?.latitude ?? 0
                                      );
                                      form.setValue(
                                        "address.longitude",
                                        activeJob?.job?.address?.longitude ?? 0
                                      );
                                    }}
                                  >
                                    <Undo className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Undo address change</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                          {activeJob?.client?.address?.formatted && (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    size="icon"
                                    type="button"
                                    variant={"outline"}
                                    onClick={() => {
                                      onChange(
                                        activeJob?.client?.address?.formatted
                                      );
                                      form.setValue(
                                        "address.latitude",
                                        activeJob?.client?.address?.latitude ??
                                          0
                                      );
                                      form.setValue(
                                        "address.longitude",
                                        activeJob?.client?.address?.longitude ??
                                          0
                                      );
                                    }}
                                  >
                                    <Home className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Set to home address</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </>
                        {/* )} */}
                      </div>
                      <FormDescription className="text-xs text-muted-foreground/75">
                        This is where the job gets fulfilled. It defaults to the
                        client&apos;s address.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
            <FormField
              control={form.control}
              name="prepTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Prep Time (Optional)
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
                    Any additional time needed before the stop?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="serviceTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Service Time
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
                    How long should the stop take?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Priority
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(e) => {
                        field.onChange(
                          e === "low" ? 0 : e === "mid" ? 50 : 100
                        );
                      }}
                      defaultValue={
                        field.value <= 33
                          ? "low"
                          : field.value <= 66
                          ? "mid"
                          : "high"
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Priority" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="mid">Mid</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />
            <FormItem className="w-full">
              <FormLabel className="text-sm font-normal text-muted-foreground">
                Time Window
              </FormLabel>
              <div className="center mt-5 flex flex-col ">
                <Controller
                  render={({ field }) => (
                    <div className="flex grow items-center gap-2">
                      <FormLabel className="w-2/12">From </FormLabel>{" "}
                      <Input
                        {...field}
                        placeholder="e.g. 40"
                        type="time"
                        className="w-10/12"
                      />
                    </div>
                  )}
                  name={`timeWindowStart`}
                  control={form.control}
                />
                <Controller
                  render={({ field }) => (
                    <div className="flex grow items-center gap-2">
                      <FormLabel className="w-2/12">To </FormLabel>{" "}
                      <Input
                        {...field}
                        placeholder="e.g. 40"
                        type="time"
                        className="w-10/12"
                      />
                    </div>
                  )}
                  name={`timeWindowEnd`}
                  control={form.control}
                />
              </div>{" "}
              <FormMessage />
            </FormItem>
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    {" "}
                    Stop Type
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select a job type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectLabel>Select a type</SelectLabel>
                          {Object.keys(JobType).map((job) => (
                            <SelectItem value={job} key={job}>
                              {job}
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
            <FormField
              control={form.control}
              name="order"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormLabel className="text-sm font-normal text-muted-foreground">
                    Order Details (Optional)
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
          {/* <div className="flex flex-col space-y-4">
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
                    Home Address
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
            name="order"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel className="text-sm font-normal text-muted-foreground">
                  Order Details (Optional)
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
        </div> */}
        </AccordionContent>
      </ScrollArea>
    </AccordionItem>
  );
};

export default StopDetailsSection;
