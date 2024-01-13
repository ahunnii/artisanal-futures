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

import { useShopModal } from "~/hooks/use-shop-modal";
import { api } from "~/utils/api";

const formSchema = z.object({
  shopName: z.string().min(1),
});

export const ShopModal = () => {
  const ShopModal = useShopModal();

  const { mutate } = api.shops.createShop.useMutation({
    onSuccess: ({ id }) => {
      window.location.assign(`/profile/shop/${id}`);
      setLoading(false);
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
      setLoading(false);
    },
    onMutate: () => {
      setLoading(true);
    },
  });
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    mutate(values);
  };

  return (
    <Modal
      title="Create shop"
      description="Add a new shop to manage products and categories."
      isOpen={ShopModal.isOpen}
      onClose={ShopModal.onClose}
    >
      <div>
        <div className="space-y-4 py-2 pb-4">
          <div className="space-y-2">
            <Form {...form}>
              <form onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}>
                <FormField
                  control={form.control}
                  name="shopName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input
                          disabled={loading}
                          placeholder="E-Commerce"
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
                    type="button"
                    onClick={ShopModal.onClose}
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
