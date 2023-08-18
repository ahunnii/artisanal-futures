"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarIcon, CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import { format } from "date-fns";
import { Control, useFieldArray, useForm, useWatch } from "react-hook-form";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { toast } from "~/components/ui/use-toast";
import { useShopCalculator } from "~/hooks/use-shop-calculator";
import { cn } from "~/utils/styles";

const accountFormSchema = z.object({
  hours: z.number(),

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

// This can come from your database or API.
const defaultValues: Partial<AccountFormValues> = {
  hours: 0,
  // dob: new Date("2023-01-23"),
};

function getTotal(payload: AccountFormValues["cart"]) {
  let total = 0;

  for (const item of payload) {
    total = total + (Number.isNaN(item?.amount ?? 0) ? 0 : item?.amount ?? 0);
  }

  return parseInt(total);
}

// function TotalAmout({ control }: { control: Control<AccountFormValues> }) {
//   const cartValues = useWatch({
//     control,
//     name: "cart",
//   });

//   return <p>{getTotal(cartValues)}</p>;
// }

export function MaterialsCostForm() {
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control: form.control,
    rules: {
      required: "Please append at least 1 item",
    },
  });
  const cartValues = useWatch({
    control: form.control,
    name: "cart",
  });

  const { materials, setMaterials } = useShopCalculator((state) => state);

  function onSubmit(data: AccountFormValues) {
    setMaterials(getTotal(cartValues));
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
      {materials}
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-8">
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          <FormField
            control={form.control}
            name="hours"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>How may hours to finish one project</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Your name"
                    {...field}
                    type="number"
                    onChange={(e) => {
                      form.setValue(`hours`, parseInt(e.target.value));
                    }}
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          {/* <FormField
          control={form.control}
          name="dob"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Date of birth</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(field.value, "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Your date of birth is used to calculate your age.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Language</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-[200px] justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? languages.find(
                            (language) => language.value === field.value
                          )?.label
                        : "Select language"}
                      <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                  <Command>
                    <CommandInput placeholder="Search language..." />
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {languages.map((language) => (
                        <CommandItem
                          value={language.label}
                          key={language.value}
                          onSelect={() => {
                            form.setValue("language", language.value);
                          }}
                        >
                          <CheckIcon
                            className={cn(
                              "mr-2 h-4 w-4",
                              language.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                          {language.label}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the language that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        /> */}

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
        {cartValues?.length > 0 && getTotal(cartValues)}
        <button
          type="button"
          onClick={() => {
            append({
              name: "append",
              amount: 0,
            });
          }}
        >
          Append
        </button>
        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
