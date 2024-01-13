import { zodResolver } from "@hookform/resolvers/zod";
import { Trash } from "lucide-react";

import { useFieldArray, useForm } from "react-hook-form";
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
import { ScrollArea } from "~/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Separator } from "~/components/ui/separator";

import {
  useShopCalculator,
  type MaterialCosts,
} from "~/apps/shop-rate-calculator/use-shop-calculator";
import { toast } from "~/components/ui/use-toast";

const materialsFormSchema = z.object({
  hours: z.number(),
  materials: z
    .array(
      z.object({
        name: z.string(),
        amount: z.number(),
        metric: z.string(),
        cost: z.number(),
        amountUsed: z.number(),
      })
    )
    .optional(),
});

type MaterialsFormValues = z.infer<typeof materialsFormSchema>;

export function MaterialsCostForm() {
  const { materialExpenses, setMaterials, setMaterialExpenses } =
    useShopCalculator((state) => state);

  const form = useForm<MaterialsFormValues>({
    resolver: zodResolver(materialsFormSchema),
    defaultValues: materialExpenses,
  });
  const { fields, append, remove } = useFieldArray({
    name: "materials",
    control: form.control,
    rules: {
      required: "Please add at least 1 item",
    },
  });

  // const getTotal = useCallback(() => {
  //   const values = form.getValues();

  //   const materialExpenses =
  //     values.expenses && values.materials.length > 0
  //       ? values.materials.reduce((total, item) => {
  //           return (
  //             total + (Number.isNaN(item?.amount ?? 0) ? 0 : item?.amount ?? 0)
  //           );
  //         }, 0)
  //       : 0;

  //   const hours = values.hours ?? 1;

  //   return materialExpenses / hours;
  // }, [form]);

  function onSubmit(data: MaterialsFormValues) {
    const { hours, materials } = data;

    const materialCosts = materials?.reduce((total, item) => {
      return total + (item.amountUsed / item.amount) * item?.cost;
    }, 0);
    setMaterials((materialCosts ?? 0) / (hours === 0 ? 1 : hours));
    setMaterialExpenses(data as MaterialCosts);
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="w-full space-y-8"
      >
        <div className="py-4">
          <FormLabel className="text-2xl">Materials</FormLabel>{" "}
          <FormDescription className="text-lg">
            These costs are per project on average
          </FormDescription>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Hours</FormLabel>{" "}
                <FormDescription>
                  How many hours do you spend on a given project? (on average)
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="Enter hours per project"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`hours`, parseInt(e.target.value));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <>
            <div className="col-span-full ">
              <FormLabel className="text-lg">Materials</FormLabel>{" "}
              <FormDescription>
                With a given product, what are the materials you use?
              </FormDescription>
            </div>{" "}
            <ScrollArea className="col-span-full max-h-96 rounded bg-slate-50  shadow-inner">
              {fields.map((field, index) => {
                return (
                  <section
                    key={field.id}
                    className="flex w-full flex-col items-end justify-between gap-4 text-left sm:col-span-full"
                  >
                    <FormField
                      control={form.control}
                      name={`materials.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Material Name</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Dye" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <div className="flex w-full flex-row gap-4">
                      <FormField
                        control={form.control}
                        name={`materials.${index}.amount`}
                        render={({ field }) => (
                          <FormItem className="w-1/2">
                            <FormLabel>Total amount of material</FormLabel>
                            <FormControl>
                              {/* <Input placeholder="e.g. Dye" {...field} /> */}

                              <div className="relative mt-2 rounded-md shadow-sm">
                                {/* <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                <span className="text-gray-500 sm:text-sm">
                                  $
                                </span>
                              </div> */}
                                <Input
                                  {...field}
                                  type="number"
                                  // className=" w-full  py-1.5 pl-7 pr-20  "
                                  className=" w-full  py-1.5 pr-20  "
                                  placeholder="e.g. 1 liter"
                                  onChange={(e) => {
                                    form.setValue(
                                      `materials.${index}.amount`,
                                      parseFloat(e.target.value)
                                    );
                                  }}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center">
                                  <label htmlFor="currency" className="sr-only">
                                    Currency
                                  </label>
                                  <Select
                                    onValueChange={(e) =>
                                      form.setValue(
                                        `materials.${index}.metric`,
                                        e
                                      )
                                    }
                                    defaultValue={form.getValues(
                                      `materials.${index}.metric` ?? "unit"
                                    )}
                                  >
                                    <SelectTrigger>
                                      <SelectValue className="h-full rounded-md border-0 border-transparent bg-transparent py-0 pl-2 pr-7  text-gray-500 ring-0 sm:text-sm" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="l">L</SelectItem>
                                      <SelectItem value="ml">mL</SelectItem>
                                      <SelectItem value="yd">
                                        yard
                                      </SelectItem>{" "}
                                      <SelectItem value="meter">
                                        meter
                                      </SelectItem>{" "}
                                      <SelectItem value="in">inch</SelectItem>{" "}
                                      <SelectItem value="unit">unit</SelectItem>{" "}
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={`materials.${index}.cost`}
                        render={({ field }) => (
                          <FormItem className="w-1/2">
                            <FormLabel>Total cost of material</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. 59.99"
                                {...field}
                                type="number"
                                onChange={(e) => {
                                  form.setValue(
                                    `materials.${index}.cost`,
                                    parseFloat(e.target.value)
                                  );
                                }}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name={`materials.${index}.amountUsed`}
                      render={({ field }) => (
                        <FormItem className="w-full">
                          <FormLabel>Amount of material used</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 59.99"
                              {...field}
                              type="number"
                              onChange={(e) => {
                                form.setValue(
                                  `materials.${index}.amountUsed`,
                                  parseFloat(e.target.value)
                                );
                              }}
                            />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      onClick={() => remove(index)}
                      variant={"destructive"}
                    >
                      <Trash />
                    </Button>
                    <Separator />
                  </section>
                );
              })}{" "}
            </ScrollArea>
          </>
        </div>
        <Button
          type="button"
          variant={"outline"}
          onClick={() => {
            append({
              name: "Material",
              amount: 0,
              amountUsed: 0,
              metric: "unit",
              cost: 0,
            });
          }}
        >
          Append
        </Button>
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
