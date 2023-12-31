import { zodResolver } from "@hookform/resolvers/zod";
import type { Shop } from "@prisma/client";

import { Trash } from "lucide-react";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { AlertModal } from "~/components/admin/modals/alert-modal";

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
import { Separator } from "~/components/ui/separator";

import { getSession, useSession } from "next-auth/react";
import { api } from "~/utils/api";
import LogoUpload from "../ui/logo-upload";
import { Textarea } from "../ui/textarea";

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

interface SettingsFormProps {
  initialData: Shop;
}

export const ShopForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const { data: sessionData } = useSession();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    form.reset({
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
    });
  }, [initialData, form]);

  const { mutate: updateRole } = api.auth.changeRole.useMutation({
    onSuccess: () => {
      toast.success("Role updated.");
    },
    onError: (error) => {
      toast.error("Something went wrong with updating your role.");
      console.error(error);
    },
  });

  const { mutate: updateShop } = api.shops.updateShop.useMutation({
    onSuccess: () => {
      toast.success("Shop updated.");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
    },
  });

  const { mutate: deleteShop } = api.shops.deleteShop.useMutation({
    onSuccess: () => {
      if (sessionData?.user?.role !== "ADMIN") {
        updateRole({ role: "USER" });
      }
      router.push("/profile");
      toast.success("Shop deleted.");
    },
    onError: (error) => {
      toast.error("Make sure you removed all products using this color first.");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      setOpen(false);
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    updateShop({
      ...data,
      shopId: params.query.shopId as string,
    });
  };

  const onDelete = () => {
    deleteShop({
      shopId: params.query.shopId as string,
    });
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            {initialData?.shopName} Dashboard
          </h3>
          <p className="text-sm text-muted-foreground">
            Configure how your store is shown to visitors
          </p>
        </div>

        {/* <Heading
          title="Shop settings"
          description="Manage store preferences"
        /> */}
        <Button
          disabled={loading}
          variant="destructive"
          size="sm"
          onClick={() => setOpen(true)}
        >
          <Trash className="h-4 w-4" />
        </Button>
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          onChange={() => console.log(form.getValues())}
          className="w-full space-y-8"
        >
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Shop name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Owner</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Owner's name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="logoPhoto"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Logo</FormLabel>
                  <FormDescription>The logo for your shop</FormDescription>
                  <FormControl>
                    <LogoUpload
                      value={field.value ?? ""}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="ownerPhoto"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Picture of Owner</FormLabel>
                  <FormDescription>Shown on the shop pages</FormDescription>
                  <FormControl>
                    <LogoUpload
                      value={field.value ?? ""}
                      disabled={loading}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="bio"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Bio</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="Owner's bio"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Shop Description</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g. Shop is the best!"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 123-456-7890"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="sm:col-span-4">
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. emaail@test.co"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem className="sm:col-span-4">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. https://test.co"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="country"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. USA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 1235 State St."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem className="sm:col-span-2 sm:col-start-1">
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. Los Angeles"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="state"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>State</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. CA"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="zip"
              render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="e.g. 90001"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            Save changes
          </Button>
        </form>
      </Form>
    </>
  );
};
