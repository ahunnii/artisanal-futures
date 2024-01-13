import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import * as z from "zod";

import { Button } from "~/components/ui/button";
import { ButtonLoader } from "~/components/ui/button-loader";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";

const emailSchema = z.object({
  email: z.string().email(),
});

type EmailFormValues = z.infer<typeof emailSchema>;

const InviteNewUser = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const form = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
  });

  const onSubmit = async (values: EmailFormValues) => {
    setLoading(true);
    const req = await fetch("/api/invite", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    });

    const res = await req.json();

    if (res?.statusCode) {
      const error = res?.message ?? "Something went wrong. Please try again.";
      toast.error(error as string);
      return;
    }

    toast.success("Invitation has been sent.");
    setLoading(false);
    setOpen(false);
    return;
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite user to Artisanal Futures</DialogTitle>
          <DialogDescription>
            To avoid password management, the user needs to create their own
            account. We will send them an email with a link to create their
            account.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
            className="space-y-5"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel className="label">
                    <span className="label-text text-error">Email</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. hwest@test.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <Button className="ml-auto gap-2" type="submit" disabled={loading}>
              {loading && <ButtonLoader />}
              Invite User
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default InviteNewUser;
