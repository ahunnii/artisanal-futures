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

import { toast } from "~/components/ui/use-toast";
import {
  LaborCosts,
  useShopCalculator,
  type MaterialCosts,
} from "~/hooks/use-shop-calculator";

const laborFormSchema = z.object({
  hours: z.number(),
  rate: z.number(),
});
const AVG_WEEK_PER_MONTH = 4.33;
type LaborFormValues = z.infer<typeof laborFormSchema>;

export function LaborCostForm() {
  const { laborExpenses, setLabor, setLaborExpenses } = useShopCalculator(
    (state) => state
  );

  const form = useForm<LaborFormValues>({
    resolver: zodResolver(laborFormSchema),
    defaultValues: laborExpenses,
  });

  function onSubmit(data: LaborFormValues) {
    const { hours, rate } = data;

    // const materialCosts = materials?.reduce((total, item) => {
    //   return total + (item.amountUsed / item.amount) * item?.cost;
    // }, 0);
    setLabor(AVG_WEEK_PER_MONTH * hours * rate);
    setLaborExpenses(data as LaborCosts);
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
          <FormLabel className="text-2xl">Labor</FormLabel>{" "}
          <FormDescription className="text-lg">
            These costs are for you, the artisan, for a typical month.
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
                  How many hours do you work per week?
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="e.g. 40"
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
          <FormField
            control={form.control}
            name="rate"
            render={({ field }) => (
              <FormItem className="sm:col-span-full">
                <FormLabel>Rate</FormLabel>{" "}
                <FormDescription>
                  How much would you consider your time to be worth? (per hour)
                </FormDescription>
                <FormControl>
                  <Input
                    placeholder="e.g. 25.75"
                    {...field}
                    onChange={(e) => {
                      form.setValue(`rate`, parseInt(e.target.value));
                    }}
                    type="number"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit">Update account</Button>
      </form>
    </Form>
  );
}
