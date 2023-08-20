"use client";

import { zodResolver } from "@hookform/resolvers/zod";

import { useCallback } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

import { toast } from "~/components/ui/use-toast";
import {
  useShopCalculator,
  type MonthlyCosts,
} from "~/hooks/use-shop-calculator";

const accountFormSchema = z.object({
  rent: z.number(),
  gas: z.number(),
  electric: z.number(),
  maintenance: z.number(),
  cart: z.array(
    z
      .object({
        name: z.string(),
        amount: z.number(),
      })
      .optional()
  ),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function MonthlyCostForm() {
  const { monthlyExpenses, setMonthly, setMonthlyExpenses } = useShopCalculator(
    (state) => state
  );

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: monthlyExpenses,
  });
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control: form.control,
    rules: {
      required: "Please append at least 1 item",
    },
  });

  const getTotal = useCallback(() => {
    const values = form.getValues();

    const extraValues = form.getValues().cart.reduce((total, item) => {
      return total + (Number.isNaN(item?.amount ?? 0) ? 0 : item?.amount ?? 0);
    }, 0);

    const baseValues =
      values.rent + values.gas + values.electric + values.maintenance;

    return extraValues + baseValues;
  }, [form]);

  function onSubmit(data: AccountFormValues) {
    setMonthlyExpenses(data as MonthlyCosts);
    setMonthly(getTotal());

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
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <FormField
            control={form.control}
            name="rent"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Monthly Rent</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter rent per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`rent`, parseInt(e.target.value));
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
                <FormLabel>Monthly Gas</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter gas per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`gas`, parseInt(e.target.value));
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
                <FormLabel>Monthly Electric</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter electric per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`electric`, parseInt(e.target.value));
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
                <FormLabel>Monthly maintenance</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter maintenance per month"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`maintenance`, parseInt(e.target.value));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {fields.map((field, index) => {
            return (
              <section
                key={field.id}
                className="flex w-full items-end justify-between gap-4 text-left sm:col-span-full"
              >
                <FormField
                  control={form.control}
                  name={`cart.${index}.name`}
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
                  name={`cart.${index}.amount`}
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
                              `cart.${index}.amount`,
                              parseInt(e.target.value)
                            );
                          }}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="button" onClick={() => remove(index)}>
                  Delete
                </Button>
              </section>
            );
          })}
        </div>

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
          Append
        </Button>
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
