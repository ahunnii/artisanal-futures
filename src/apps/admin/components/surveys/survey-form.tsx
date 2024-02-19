import { zodResolver } from "@hookform/resolvers/zod";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { CheckIcon, Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import type { Shop, Survey, User } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "~/components/ui/command";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { api } from "~/utils/api";

import { useSession } from "next-auth/react";
import { AlertModal } from "~/apps/admin/components/modals/alert-modal";
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
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import LogoUpload from "~/components/ui/logo-upload";

import { Separator } from "~/components/ui/separator";
import { Switch } from "~/components/ui/switch";
import { Textarea } from "~/components/ui/textarea";
import { cn } from "~/utils/styles";

const formSchema = z.object({
  shopId: z.string(),
  ownerId: z.string(),
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

type SurveyFormValues = z.infer<typeof formSchema>;

interface ColorFormProps {
  initialData: Survey | null;
}

export const SurveyForm: React.FC<ColorFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const utils = api.useContext();

  const { data: users } = api.user.getAllUsers.useQuery() ?? [];
  const { data: shops } = api.shops.getAllShops.useQuery() ?? [];
  const { data: sessionData } = useSession();

  const [open, setOpen] = useState<boolean>(false);
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [openStores, setOpenStores] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const title = initialData ? "Edit survey" : "Create survey";
  const description = initialData ? "Edit a survey." : "Add a new survey";
  const toastMessage = initialData ? "Survey updated." : "Survey created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<SurveyFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopId: initialData?.shopId ?? "",
      ownerId: initialData?.ownerId ?? sessionData?.user.id,
      processes: initialData?.processes ?? sessionData?.user.name ?? "",
      materials: initialData?.materials ?? "",
      principles: initialData?.principles ?? "",
      description: initialData?.description ?? "",

      unmoderatedForm: initialData?.unmoderatedForm ?? undefined,
      moderatedForm: initialData?.moderatedForm ?? undefined,
      hiddenForm: initialData?.hiddenForm ?? undefined,
      privateForm: initialData?.privateForm ?? undefined,
      supplyChain: initialData?.supplyChain ?? undefined,
      messagingOptIn: initialData?.messagingOptIn ?? undefined,
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

  const { mutate: createSurvey } = api.surveys.createSurvey.useMutation({
    onSuccess: () => {
      router.push(`/admin/surveys/`);
      toast.success(toastMessage);
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
      void utils.shops.getShopById.invalidate();
    },
  });

  const { mutate: deleteSurvey } = api.surveys.deleteSurvey.useMutation({
    onSuccess: () => {
      router.push(`/admin/shops`);
      toast.success("Shop deleted.");
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
      setOpen(false);
      void utils.shops.getAllShops.invalidate();
    },
  });

  const onSubmit = (data: SurveyFormValues) => {
    if (initialData) {
      updateSurvey({ ...data, surveyId: params?.query?.surveyId as string });
    } else {
      createSurvey({
        ...data,
      });
    }
  };

  const onDelete = () => {
    deleteSurvey({
      surveyId: params?.query?.surveyId as string,
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
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={(event) => void form.handleSubmit(onSubmit)(event)}
          className="w-full space-y-8"
        >
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="col-span-full flex w-full items-center gap-4">
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Owner</FormLabel>
                    <FormDescription>
                      Owner attached to the survey
                    </FormDescription>
                    <FormControl>
                      {users && users?.length > 0 && (
                        <Popover
                          open={openAccounts}
                          onOpenChange={setOpenAccounts}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between"
                            >
                              {users && field.value
                                ? users?.find(
                                    (framework: User) =>
                                      framework.id === form.getValues("ownerId")
                                  )!.name ?? "Owner"
                                : "Select shop owner..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search framework..."
                                className="h-9"
                              />
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {users?.map((framework) => (
                                  <CommandItem
                                    key={framework.id}
                                    value={framework.id}
                                    onSelect={(currentValue) => {
                                      field.onChange(
                                        currentValue === field.value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    {framework.name} -- {framework.email}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value === framework.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <FormField
                control={form.control}
                name="shopId"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Shop</FormLabel>
                    <FormDescription>
                      Shop attached to the survey
                    </FormDescription>
                    <FormControl>
                      {shops && shops?.length > 0 && (
                        <Popover open={openStores} onOpenChange={setOpenStores}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="w-[200px] justify-between"
                            >
                              {shops && field.value
                                ? shops?.find(
                                    (framework: Shop) =>
                                      framework.id === form.getValues("shopId")
                                  )!.shopName ?? "Shop"
                                : "Select shop..."}
                              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[200px] p-0">
                            <Command>
                              <CommandInput
                                placeholder="Search framework..."
                                className="h-9"
                              />
                              <CommandEmpty>No framework found.</CommandEmpty>
                              <CommandGroup>
                                {shops?.map((framework) => (
                                  <CommandItem
                                    key={framework.id}
                                    value={framework.id}
                                    onSelect={(currentValue) => {
                                      field.onChange(
                                        currentValue === field.value
                                          ? ""
                                          : currentValue
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    {framework.shopName}
                                    <CheckIcon
                                      className={cn(
                                        "ml-auto h-4 w-4",
                                        field.value === framework.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      )}
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>Tell us about your business</FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g. This business is...."
                      {...field}
                    />
                  </FormControl>{" "}
                  <FormDescription>
                    This is different from what you have put on the shop page:
                    the more you can say, the better! Pretend its an interview
                    -- what can you say that gives folks a deeper understanding?
                    Start with the basics about your products or services. What
                    makes them special? Cultural roots, healthy growing,
                    precision engineering, feminist practices? Your relations to
                    the community or customers?
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="processes"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>
                    {" "}
                    What are some of your business processes?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g. textiles, bead making"
                      {...field}
                    />
                  </FormControl>{" "}
                  <FormDescription>
                    Some examples of processes could be: textiles, woodworking,
                    metalworking, digital fabrication, print media,
                    heating/cooling, solar, farming/growing, and more!
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="materials"
              render={({ field }) => (
                <FormItem className="col-span-full">
                  <FormLabel>
                    {" "}
                    What are some materials that go into your business?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g. satin, silk, cotton, wool"
                      {...field}
                    />
                  </FormControl>{" "}
                  <FormDescription>
                    Some examples of processes could be: cotton, yarn, glass,
                    dyes, inks, etc.
                  </FormDescription>
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
                    {" "}
                    What are some principles when running your business?
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      disabled={loading}
                      placeholder="e.g. black owned, sustainability, LGBTQ+ / Gender neutral"
                      {...field}
                    />
                  </FormControl>{" "}
                  <FormDescription>
                    Some examples of principles could be: black owned, female
                    owned, community education, african american civil rights,
                    LGBTQ/Gender neutral, Carbon neutral/sustainability and
                    environmental friendliness, etc.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="unmoderatedForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Unmoderated Form
                    </FormLabel>
                    <FormDescription>
                      Mark a minimum amount for order to qualify for free
                      shipping.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="moderatedForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Moderated Form</FormLabel>
                    <FormDescription>
                      Mark a minimum amount for order to qualify for free
                      shipping.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="hiddenForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Hidden Form</FormLabel>
                    <FormDescription>
                      Mark a minimum amount for order to qualify for free
                      shipping.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="privateForm"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">privateForm</FormLabel>
                    <FormDescription>
                      Mark a minimum amount for order to qualify for free
                      shipping.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="supplyChain"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Supply Chain</FormLabel>
                    <FormDescription>
                      Mark a minimum amount for order to qualify for free
                      shipping.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="messagingOptIn"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">
                      Messaging Opt-In
                    </FormLabel>
                    <FormDescription>
                      Mark a minimum amount for order to qualify for free
                      shipping.
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          {/* <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="shopName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Color name"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="logoPhoto"
              render={({ field }) => (
                <FormItem className="sm:col-span-3">
                  <FormLabel>Logo</FormLabel>
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
            <div>
              <FormField
                control={form.control}
                name="ownerId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Owner</FormLabel>
                    <FormControl>
                      <>
            
                        {users && users?.length > 0 && (
                          <Popover
                            open={openAccounts}
                            onOpenChange={setOpenAccounts}
                          >
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[200px] justify-between"
                              >
                                {users && field.value
                                  ? users?.find(
                                      (framework: User) =>
                                        framework.id ===
                                        form.getValues("ownerId")
                                    )!.name ?? "Owner"
                                  : "Select framework..."}
                                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[200px] p-0">
                              <Command>
                                <CommandInput
                                  placeholder="Search framework..."
                                  className="h-9"
                                />
                                <CommandEmpty>No framework found.</CommandEmpty>
                                <CommandGroup>
                                  {users?.map((framework) => (
                                    <CommandItem
                                      key={framework.id}
                                      value={framework.id}
                                      onSelect={(currentValue) => {
                                        field.onChange(
                                          currentValue === field.value
                                            ? ""
                                            : currentValue
                                        );
                                        setOpen(false);
                                      }}
                                    >
                                      {framework.name} -- {framework.email}
                                      <CheckIcon
                                        className={cn(
                                          "ml-auto h-4 w-4",
                                          field.value === framework.id
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        )}
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div> */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
