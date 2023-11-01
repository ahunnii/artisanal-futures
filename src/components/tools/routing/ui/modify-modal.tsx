import { zodResolver } from "@hookform/resolvers/zod";

import { useState } from "react";
import { useForm } from "react-hook-form";

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

import { Modal } from "~/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { useModifyModal } from "~/hooks/routing/use-modify-modal";

const formSchema = z.object({
  type: z.enum(["stop", "driver"]),
});

export const ModifyModal = () => {
  const modifyModal = useModifyModal();

  //   const { mutate } = api.store.createStore.useMutation({
  //     onSuccess: ({ id }) => {
  //       window.location.assign(`/${id}`);
  //       setLoading(false);
  //     },
  //     onError: (error) => {
  //       toast.error("Something went wrong");
  //       console.error(error);
  //       setLoading(false);
  //     },
  //     onMutate: () => {
  //       setLoading(true);
  //     },
  //   });
  const [loading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // mutate(values);

    console.log(values);
  };

  return (
    <Modal
      title="Modify all"
      description="Modify all stops or drivers"
      isOpen={modifyModal.isOpen}
      onClose={modifyModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select what you want to modify" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="stop">Stop</SelectItem>
                            <SelectItem value="driver">Driver</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex w-full items-center justify-end space-x-2 pt-6">
                  <Button
                    disabled={loading}
                    variant="outline"
                    onClick={modifyModal.onClose}
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
