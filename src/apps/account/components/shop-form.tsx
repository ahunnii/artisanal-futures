import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Shop } from "@prisma/client";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { DeleteItem } from "~/components/delete-item";
import { Button } from "~/components/ui/button";
import * as Form from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import LogoUpload from "~/components/ui/logo-upload";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

import { toast } from "~/apps/notifications/libs/toast";

import { useModal } from "~/hooks/use-modal";
import { api } from "~/utils/api";

const formSchema = z.object({
  shopName: z.string().min(2),
  ownerName: z.string(),
  bio: z.string().optional(),
  description: z.string().optional(),
  logoPhoto: z.string().optional(),
  ownerPhoto: z.string().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zip: z.string().optional(),
  country: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().optional(),
  website: z.string().optional(),
});

type SettingsFormValues = z.infer<typeof formSchema>;

type TShopFormProps = {
  initialData: Shop | null;
  onboardingView?: boolean;
};

export const ShopForm: React.FC<TShopFormProps> = ({
  initialData,
  onboardingView = false,
}) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const { data: sessionData } = useSession();
  const alertModal = useModal((state) => state);
  const [loading, setLoading] = useState(false);

  const { shopId } = params.query as { shopId: string };
  const apiContext = api.useContext();

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: initialData?.shopName ?? "",
      ownerName: initialData?.ownerName ?? "",
      bio: initialData?.bio ?? "",
      description: initialData?.description ?? "",
      logoPhoto: initialData?.logoPhoto ?? "",
      ownerPhoto: initialData?.ownerPhoto ?? "",
      address: initialData?.address ?? "",
      city: initialData?.city ?? "",
      state: initialData?.state ?? "",
      zip: initialData?.zip ?? "",
      country: initialData?.country ?? "",
      phone: initialData?.phone ?? "",
      email: initialData?.email ?? "",
      website: initialData?.website ?? "",
    },
  });

  const { mutate: updateRole } = api.auth.changeRole.useMutation({
    onSuccess: () => toast.success("Role updated."),
    onError: (error) =>
      toast.error("Something went wrong with updating your role.", error),
  });

  const { mutate: updateShop } = api.shops.updateShop.useMutation({
    onSuccess: () => toast.success("Shop updated."),
    onError: (error) => toast.error("Something went wrong", error),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      void apiContext.shops.invalidate();
    },
  });

  const { mutate: deleteShop } = api.shops.deleteShop.useMutation({
    onSuccess: () => {
      if (sessionData?.user?.role !== "ADMIN") updateRole({ role: "USER" });
      router.push("/profile");
      toast.success("Shop deleted.");
    },
    onError: (error) =>
      toast.error("An error has occurred deleting your shop.", error),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      void apiContext.shops.invalidate();
      alertModal.onClose();
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateShop({
      ...data,
      shopId,
    });
  };

  const onDelete = () => {
    deleteShop({ shopId });
  };

  return (
    <>
      {!onboardingView && (
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-medium">
              {initialData?.shopName} Dashboard
            </h3>
            <p className="text-sm text-muted-foreground">
              Configure how your store is shown to visitors
            </p>
          </div>

          <DeleteItem
            isDisabled={loading}
            confirmCallback={onDelete}
            {...alertModal}
          />
        </div>
      )}
      <Separator />
      <Form.Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="w-full space-y-8"
        >
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <Form.FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>Name</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Shop name"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />{" "}
            <Form.FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>Owner</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Owner's name"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />{" "}
            <Form.FormField
              control={form.control}
              name="logoPhoto"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>Logo</Form.FormLabel>
                  <Form.FormDescription>
                    The logo for your shop
                  </Form.FormDescription>
                  <Form.FormControl>
                    <LogoUpload
                      value={field.value ?? ""}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />{" "}
            <Form.FormField
              control={form.control}
              name="ownerPhoto"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>Picture of Owner</Form.FormLabel>
                  <Form.FormDescription>
                    Shown on the shop pages
                  </Form.FormDescription>
                  <Form.FormControl>
                    <LogoUpload
                      value={field.value ?? ""}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />{" "}
            <Form.FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <Form.FormItem className="col-span-full">
                  <Form.FormLabel>Bio</Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Owner's bio"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />{" "}
            <Form.FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <Form.FormItem className="col-span-full">
                  <Form.FormLabel>Shop Description</Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g. Shop is the best!"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>Phone</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 123-456-7890"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-4">
                  <Form.FormLabel>Email</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. emaail@test.co"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-4">
                  <Form.FormLabel>Website</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. https://test.co"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>Country</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. USA"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <Form.FormItem className="col-span-full">
                  <Form.FormLabel>Address</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 1235 State St."
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-2 sm:col-start-1">
                  <Form.FormLabel>City</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. Los Angeles"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-2">
                  <Form.FormLabel>State</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. CA"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-2">
                  <Form.FormLabel>Zip</Form.FormLabel>
                  <Form.FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 90001"
                      {...field}
                    />
                  </Form.FormControl>
                  <Form.FormMessage />
                </Form.FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form.Form>
    </>
  );
};
