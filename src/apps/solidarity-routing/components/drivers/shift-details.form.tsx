import type { FC } from "react";

import { uniqueId } from "lodash";
import { Plus, Trash } from "lucide-react";
import { Controller, useFieldArray, type UseFormReturn } from "react-hook-form";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import { Button } from "~/components/ui/button";
import {
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";

import type { DriverFormValues } from "../../types.wip";

import { cn } from "~/utils/styles";

type DriverDetailsSectionProps = {
  form: UseFormReturn<DriverFormValues>;
};

const ShiftDetailsSection: FC<DriverDetailsSectionProps> = ({ form }) => {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "breaks",
  });
  return (
    <AccordionItem value="item-3">
      <AccordionTrigger>Shift Information</AccordionTrigger>
      <AccordionContent className="px-2">
        <p className="leading-7 [&:not(:first-child)]:mt-6">
          Add specific information about this shift.
        </p>

        <div className="space-y-4 p-4">
          <FormItem className="py-4">
            <FormLabel>Driver Shift</FormLabel>
            <div className="center mt-5 flex flex-col ">
              <Controller
                render={({ field }) => (
                  <div className="flex grow items-center gap-2">
                    <FormLabel className="w-2/12">Start </FormLabel>{" "}
                    <Input
                      {...field}
                      placeholder="e.g. 40"
                      type="time"
                      className="w-10/12"
                    />
                  </div>
                )}
                name={`shift.start`}
                control={form.control}
              />
              <Controller
                render={({ field }) => (
                  <div className="flex grow items-center gap-2">
                    <FormLabel className="w-2/12">End </FormLabel>{" "}
                    <Input
                      {...field}
                      placeholder="e.g. 40"
                      type="time"
                      className="w-10/12"
                    />
                  </div>
                )}
                name={`shift.end`}
                control={form.control}
              />
            </div>{" "}
            <FormMessage />
          </FormItem>

          <div className="my-4 flex flex-col border border-slate-200 bg-slate-50 p-4">
            <div className="flex justify-between">
              <FormLabel className="text-lg">Breaks</FormLabel>

              <Button
                onClick={() =>
                  append({
                    id: parseInt(uniqueId()),
                    duration: 30,
                  })
                }
                type="button"
                size={"sm"}
                className="flex space-x-1"
                disabled={fields.length >= 3}
              >
                <Plus className="h-4 w-4" /> <span>Add Break</span>
              </Button>
            </div>
            {/* <div className="mt-5 flex max-h-96 flex-col space-y-4 overflow-y-auto border border-slate-200"> */}
            <ScrollArea className="relative my-2 h-72 flex-col shadow-inner">
              <>
                {fields.map((item, index) => {
                  return (
                    <div
                      className={cn(
                        " flex flex-col space-y-2 px-4 py-2",
                        index % 2 === 0 ? "bg-slate-200" : ""
                      )}
                      key={item.id}
                    >
                      <div className="space-y-4 pl-2">
                        <Controller
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Break {index + 1}</FormLabel>
                              <div className="flex w-full gap-4">
                                <div className="relative w-full ">
                                  <Input
                                    placeholder="e.g. 30"
                                    className="block w-full rounded-md py-1.5 pr-12  text-gray-900     sm:text-sm sm:leading-6"
                                    {...field}
                                    type="number"
                                  />
                                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                    <span className="text-gray-500 sm:text-sm">
                                      min
                                    </span>
                                  </div>
                                </div>

                                <Button
                                  onClick={() => remove(index)}
                                  variant="destructive"
                                  className="space-x-1 text-xs"
                                  type="button"
                                  size={"sm"}
                                >
                                  <Trash className="h-4 w-4" />{" "}
                                </Button>
                              </div>

                              <FormMessage />
                            </FormItem>
                          )}
                          name={`breaks.${index}.duration`}
                          control={form.control}
                          defaultValue={Number(item.duration)}
                        />
                      </div>
                    </div>
                  );
                })}
              </>
            </ScrollArea>
            <FormDescription>
              Add a list of breaks that the driver can take. Indicating just the
              duration will assume anytime during the shift.
            </FormDescription>{" "}
            <FormMessage />
          </div>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
};

export default ShiftDetailsSection;
