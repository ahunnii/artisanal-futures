import { zodResolver } from "@hookform/resolvers/zod";
import { Package, PackageCheck, PackageXIcon } from "lucide-react";

import { useForm } from "react-hook-form";
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
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

import { Textarea } from "~/components/ui/textarea";
import { toast } from "~/components/ui/use-toast";

const notificationsFormSchema = z.object({
  status: z
    .enum(["failed", "success", "pending"], {
      required_error: "You need to select a notification type.",
    })
    .optional(),

  deliveryNotes: z.string(),
});

type NotificationsFormValues = z.infer<typeof notificationsFormSchema>;

// This can come from your database or API.
const defaultValues: Partial<NotificationsFormValues> = {
  status: "pending",
};

export function CurrentStopForm({
  callback,
}: {
  callback: (data: NotificationsFormValues) => void;
}) {
  const form = useForm<NotificationsFormValues>({
    resolver: zodResolver(notificationsFormSchema),
    defaultValues,
  });

  function onSubmit(data: NotificationsFormValues) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });

    callback(data);
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-8"
      >
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="space-y-1">
              <FormLabel>Status</FormLabel>
              <FormDescription>
                Select the theme for the dashboard.
              </FormDescription>
              <FormMessage />
              <RadioGroup
                onValueChange={field.onChange}
                defaultValue={field.value}
                className="grid max-w-md grid-cols-4 gap-8 pt-2"
              >
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="failed" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                      <div className="space-y-2 rounded-sm bg-red-200 p-2">
                        <PackageXIcon />
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Failed
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="success" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm  bg-green-200  p-2">
                        <PackageCheck />
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Success
                    </span>
                  </FormLabel>
                </FormItem>
                <FormItem>
                  <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                    <FormControl>
                      <RadioGroupItem value="pending" className="sr-only" />
                    </FormControl>
                    <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                      <div className="space-y-2 rounded-sm  bg-gray-200  p-2">
                        <Package />
                      </div>
                    </div>
                    <span className="block w-full p-2 text-center font-normal">
                      Pending
                    </span>
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deliveryNotes"
          render={({ field }) => (
            <FormItem className="flex flex-col  justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Delivery Notes</FormLabel>
                <FormDescription>
                  Add anything you wish the dispatcher to know about this stop.
                </FormDescription>
              </div>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
            </FormItem>
          )}
        />

        <Button type="submit">Update stop</Button>
      </form>
    </Form>
  );
}
