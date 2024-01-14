import { useRouter as useNavigationRouter } from "next/navigation";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Shop, Survey } from "@prisma/client";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { DeleteItem } from "~/components/delete-item";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import * as Form from "~/components/ui/form";
import { Separator } from "~/components/ui/separator";
import { Textarea } from "~/components/ui/textarea";

import { toast } from "~/apps/notifications/libs/toast";

import { useModal } from "~/hooks/use-modal";
import { api } from "~/utils/api";

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

type TSurveyFormProps = {
  initialData: Survey | null;
  shop: Shop;
};

export const SurveyForm: React.FC<TSurveyFormProps> = ({
  initialData,
  shop,
}) => {
  const alertModal = useModal((state) => state);

  const apiContext = api.useContext();
  const router = useNavigationRouter();

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

  const { mutate: createSurvey } = api.surveys.createSurvey.useMutation({
    onSuccess: () => toast.success("Survey created."),
    onError: (error) => toast.error("Something went wrong", error),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      void apiContext.surveys.getCurrentUserShopSurvey.invalidate();
    },
  });

  const { mutate: updateSurvey } = api.surveys.updateSurvey.useMutation({
    onSuccess: () => toast.success("Shop updated."),
    onError: (error) => toast.error("Something went wrong", error),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      void apiContext.surveys.getCurrentUserShopSurvey.invalidate();
    },
  });

  const { mutate: deleteSurvey } = api.surveys.deleteSurvey.useMutation({
    onSuccess: () => {
      router.push("/profile");
      toast.success("Shop deleted.");
    },
    onError: (error) =>
      toast.error(
        "There was an error deleting the survey. Please try again later.",
        error
      ),
    onMutate: () => setLoading(true),
    onSettled: () => {
      setLoading(false);
      alertModal.onClose();
      void apiContext.surveys.getCurrentUserShopSurvey.invalidate();
    },
  });

  const onSubmit = (data: SettingsFormValues) => {
    if (initialData)
      updateSurvey({
        ...data,
        surveyId: initialData.id,
      });
    else
      createSurvey({
        ...data,
        shopId: shop?.id,
      });
  };

  const onDelete = () => {
    if (initialData)
      deleteSurvey({
        surveyId: initialData?.id,
      });
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">
            Survey Dashboard:{" "}
            <span>
              {initialData?.id ? "Update Survey" : "New Survey"}{" "}
              {shop ? `for ${shop.shopName ?? "your shop"}` : ""}{" "}
            </span>
          </h3>
          <p className="text-sm text-muted-foreground">
            Let us know more about your business and preferences
          </p>
        </div>

        {initialData && (
          <DeleteItem
            isDisabled={loading}
            confirmCallback={onDelete}
            {...alertModal}
          />
        )}
      </div>
      <Separator />
      <Form.Form {...form}>
        <form
          onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
          className="w-full space-y-8"
        >
          <div className="gap-8 md:grid md:grid-cols-3">
            <Form.FormField
              control={form.control}
              name="processes"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>
                    What are some of your business processes?
                  </Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
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
              name="materials"
              render={({ field }) => (
                <Form.FormItem className="sm:col-span-3">
                  <Form.FormLabel>
                    What are some materials that go into your business?
                  </Form.FormLabel>
                  <Form.FormControl>
                    <Textarea
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
              name="principles"
              render={({ field }) => (
                <Form.FormItem className="col-span-full">
                  <Form.FormLabel>
                    What are some principles when running your business?
                  </Form.FormLabel>
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
              name="unmoderatedForm"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Unmoderated Form</Form.FormLabel>
                    <Form.FormDescription>
                      This marks that you are interested in unmoderated forms w/
                      the community.
                    </Form.FormDescription>
                  </div>
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="moderatedForm"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Moderated Form</Form.FormLabel>
                    <Form.FormDescription>
                      This marks that you are interested in moderated forms w/
                      the community.
                    </Form.FormDescription>
                  </div>
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="hiddenForm"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Hidden Form</Form.FormLabel>
                    <Form.FormDescription>
                      This marks that you are interested in hidden forms w/ the
                      community.
                    </Form.FormDescription>
                  </div>
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="privateForm"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Private Form</Form.FormLabel>
                    <Form.FormDescription>
                      This marks that you are interested in private forms w/ the
                      community.
                    </Form.FormDescription>
                  </div>
                </Form.FormItem>
              )}
            />
            <Form.FormField
              control={form.control}
              name="supplyChain"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Supply Chain</Form.FormLabel>
                    <Form.FormDescription>
                      This marks that you are interested in becoming part of the
                      artisan supply chain.
                    </Form.FormDescription>
                  </div>
                </Form.FormItem>
              )}
            />{" "}
            <Form.FormField
              control={form.control}
              name="messagingOptIn"
              render={({ field }) => (
                <Form.FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <Form.FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </Form.FormControl>
                  <div className="space-y-1 leading-none">
                    <Form.FormLabel>Opt In to Text Messages</Form.FormLabel>
                    <Form.FormDescription>
                      This marks that you are opting in to the messaging service
                      aspect of our routing app and will receive text messages
                      from us.
                    </Form.FormDescription>
                  </div>
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
