import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, Trash } from "lucide-react";
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
import { toast } from "~/components/ui/use-toast";

import {
  useShopCalculator,
  type MonthlyCosts,
} from "~/hooks/use-shop-calculator";

const monthlyFormSchema = z.object({
  rent: z.number().optional(),
  gas: z.number().optional(),
  electric: z.number().optional(),
  maintenance: z.number().optional(),
  additional: z.array(
    z.object({ name: z.string(), amount: z.number() }).optional()
  ),
});

type MonthlyFormValues = z.infer<typeof monthlyFormSchema>;

export function MonthlyCostForm() {
  const { monthlyExpenses, setMonthly, setMonthlyExpenses } = useShopCalculator(
    (state) => state
  );

  const form = useForm<MonthlyFormValues>({
    resolver: zodResolver(monthlyFormSchema),
    defaultValues: {
      rent: monthlyExpenses?.rent ?? 0,
      gas: monthlyExpenses?.gas ?? 0,
      electric: monthlyExpenses?.electric ?? 0,
      maintenance: monthlyExpenses?.maintenance ?? 0,
      additional: monthlyExpenses?.cart ?? [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    name: "additional",
    control: form.control,
    rules: {
      required: "Please append at least 1 item",
    },
  });

  const onSubmit = (data: MonthlyFormValues) => {
    const { rent, gas, electric, maintenance } = data;
    const additional = data.additional.reduce(
      (total, item) => (item?.amount ?? 0) + total,
      0
    );

    setMonthly(
      (rent ?? 0) +
        (gas ?? 0) +
        (electric ?? 0) +
        (maintenance ?? 0) +
        additional
    );

    setMonthlyExpenses(data as MonthlyCosts);

    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
        className="w-full space-y-8"
      >
        <div className="py-4">
          <FormLabel className="text-2xl">Monthly Expenses</FormLabel>{" "}
          <FormDescription className="text-lg">
            These are fixed costs per month
          </FormDescription>
        </div>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <FormField
            control={form.control}
            name="rent"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Rent</FormLabel>
                <FormDescription>
                  How much do you pay for rent per month?
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="Enter rent per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`rent`, parseFloat(e.target.value));
                    }}
                    type="number"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="gas"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel> Gas</FormLabel>{" "}
                <FormDescription>
                  How much do you pay for heat / gas per month? (on average)
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="Enter gas per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`gas`, parseFloat(e.target.value));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="electric"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Electric</FormLabel>
                <FormDescription>
                  How much do you pay for electric per month? (on average)
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="Enter electric per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`electric`, parseFloat(e.target.value));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="maintenance"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Monthly maintenance</FormLabel>{" "}
                <FormDescription>
                  How much do you pay for maintenance and upkeep per month? (on
                  average)
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="Enter maintenance per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`maintenance`, parseFloat(e.target.value));
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <>
            <div className="col-span-full ">
              <FormLabel className="text-lg">Additional Expenses</FormLabel>{" "}
              <FormDescription>
                Any other expenses that you pay per month?
              </FormDescription>
            </div>
            <ScrollArea className="col-span-full max-h-96 rounded bg-slate-50  shadow-inner">
              {fields.map((field, index) => {
                return (
                  <div
                    key={field.id}
                    className="flex w-full items-end justify-between gap-4 p-2 text-left sm:col-span-full"
                  >
                    <FormField
                      control={form.control}
                      name={`additional.${index}.name`}
                      render={({ field }) => (
                        <FormItem className="w-1/2">
                          <FormLabel>Expense</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g. Dye" {...field} />
                          </FormControl>

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`additional.${index}.amount`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cost</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. 59.99"
                              {...field}
                              type="number"
                              onChange={(e) => {
                                form.setValue(
                                  `additional.${index}.amount`,
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
                      variant="destructive"
                      type="button"
                      size={"icon"}
                      onClick={() => remove(index)}
                    >
                      <Trash />
                    </Button>
                  </div>
                );
              })}
            </ScrollArea>
          </>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant={"outline"}
            onClick={() => {
              append({
                name: "New expense",
                amount: 0,
              });
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add new expense
          </Button>
          <Button type="submit">Update account</Button>
        </div>
      </form>
    </Form>
  );
}
