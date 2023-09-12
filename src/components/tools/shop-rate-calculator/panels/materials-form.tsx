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
  type MaterialCosts,
} from "~/hooks/use-shop-calculator";

const accountFormSchema = z.object({
  hours: z.number().optional(),
  expenses: z
    .array(
      z
        .object({
          name: z.string(),
          amount: z.number(),
        })
        .optional()
    )
    .optional(),
});

type AccountFormValues = z.infer<typeof accountFormSchema>;

export function MaterialsCostForm() {
  const { materialExpenses, setMaterials, setMaterialExpenses } =
    useShopCalculator((state) => state);

  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues: materialExpenses,
  });
  const { fields, append, remove } = useFieldArray({
    name: "expenses",
    control: form.control,
    rules: {
      required: "Please add at least 1 item",
    },
  });

  const getTotal = useCallback(() => {
    const values = form.getValues();

    const materialExpenses =
      values.expenses && values.expenses.length > 0
        ? values.expenses.reduce((total, item) => {
            return (
              total + (Number.isNaN(item?.amount ?? 0) ? 0 : item?.amount ?? 0)
            );
          }, 0)
        : 0;

    const hours = values.hours ?? 1;

    return materialExpenses / hours;
  }, [form]);

  function onSubmit(data: AccountFormValues) {
    setMaterialExpenses(data as MaterialCosts);
    setMaterials(getTotal());

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
            name="hours"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Hours</FormLabel>
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
          {fields.map((field, index) => {
            return (
              <section
                key={field.id}
                className="flex w-full items-end justify-between gap-4 text-left sm:col-span-full"
              >
                <FormField
                  control={form.control}
                  name={`expenses.${index}.name`}
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
                  name={`expenses.${index}.amount`}
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
                              `expenses.${index}.amount`,
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