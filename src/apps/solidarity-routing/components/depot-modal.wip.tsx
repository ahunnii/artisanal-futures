import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
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
import { Modal } from "~/components/ui/modal";

import { useDepotModal } from "~/apps/solidarity-routing/hooks/use-depot-modal.wip";
import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(1),
  // address: z.string().min(1),
});

export const DepotModal = () => {
  const depotModal = useDepotModal();

  const { mutate } = api.depots.createDepot.useMutation({
    onSuccess: ({ id }) =>
      window.location.assign(`/tools/solidarity-pathways/${id}`),
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => setLoading(true),
    onSettled: () => setLoading(false),
  });
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <Modal
      title="Create depot"
      description="Create a new depot to get started with routing."
      isOpen={depotModal.isOpen}
      onClose={depotModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="e.g. Deep Blue Sea Delivery"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full items-center justify-end space-x-2 pt-6">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={depotModal.onClose}
                  >
                    Cancel
                  </Button>{" "}
                  <Button disabled={loading} type="submit">
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </Modal>
  );
};
