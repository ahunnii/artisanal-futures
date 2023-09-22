import { zodResolver } from "@hookform/resolvers/zod";
import type { Survey } from "@prisma/client";

import { Trash } from "lucide-react";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { useRouter as useNavigationRouter } from "next/navigation";

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

import { api } from "~/utils/api";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

const formSchema = z.object({
  processes: z.string().optional(),
  materials: z.string().optional(),
  principles: z.string().optional(),
  description: z.string().optional(),
  unmoderatedForm: z.boolean().default(false),
  moderatedForm: z.boolean().default(false),
  hiddenForm: z.boolean().default(false),
  privateForm: z.boolean().default(false),
  supplyChain: z.boolean().default(false),
  messagingOptIn: z.boolean().default(false),
});

type SettingsFormValues = z.infer<typeof formSchema>;

interface SettingsFormProps {
  initialData: Survey;
}

export const SurveyForm: React.FC<SettingsFormProps> = ({ initialData }) => {
  const { data: shop } = api.shops.getShop.useQuery({
    shopId: initialData.shopId,
  });
  const router = useNavigationRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<SettingsFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      processes: initialData?.processes ?? "",
      materials: initialData?.materials ?? "",
      principles: initialData?.principles ?? "",
      description: initialData?.description ?? "",
      unmoderatedForm: initialData?.unmoderatedForm ?? false,
      moderatedForm: initialData?.moderatedForm ?? false,
      hiddenForm: initialData?.hiddenForm ?? false,
      privateForm: initialData?.privateForm ?? false,
      supplyChain: initialData?.supplyChain ?? false,
    },
  });

  const { mutate: updateSurvey } = api.surveys.updateSurvey.useMutation({
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

  const { mutate: deleteSurvey } = api.surveys.deleteSurvey.useMutation({
    onSuccess: () => {
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
    updateSurvey({
      ...data,
      surveyId: initialData.id,
    });
  };

  const onDelete = () => {
    deleteSurvey({
      surveyId: initialData.id,
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
            Survey Dashboard:{" "}
            <span>
              {initialData?.id ?? "Null"} {shop ? `for ${shop.shopName}` : ""}{" "}
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Let us know more about your business and preferences
          </p>
        </div>

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
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="processes"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>
                    What are some of your business processes?
                  </FormLabel>
                  <FormControl>
                    <Textarea
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
              name="materials"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>
                    What are some materials that go into your business?
                  </FormLabel>
                  <FormControl>
                    <Textarea
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
              name="principles"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>
                    What are some principles when running your business?
                  </FormLabel>
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
              name="unmoderatedForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Unmoderated Form</FormLabel>
                    <FormDescription>
                      This marks that you are interested in unmoderated forms w/
                      the community.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moderatedForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Moderated Form</FormLabel>
                    <FormDescription>
                      This marks that you are interested in moderated forms w/
                      the community.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hiddenForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Hidden Form</FormLabel>
                    <FormDescription>
                      This marks that you are interested in hidden forms w/ the
                      community.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="privateForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Private Form</FormLabel>
                    <FormDescription>
                      This marks that you are interested in private forms w/ the
                      community.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="supplyChain"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Supply Chain</FormLabel>
                    <FormDescription>
                      This marks that you are interested in becoming part of the
                      artisan supply chain.
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="messagingOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Opt In to Text Messages</FormLabel>
                    <FormDescription>
                      This marks that you are opting in to the messaging service
                      aspect of our routing app and will receive text messages
                      from us.
                    </FormDescription>
                  </div>
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
