import { useRouter as useNavigationRouter } from "next/navigation";
import { useRouter } from "next/router";
import { useState } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import type { Account, Session, User } from "@prisma/client";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import { Trash } from "lucide-react";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import * as z from "zod";

import { AlertModal } from "~/apps/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { Heading } from "~/components/ui/heading";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Separator } from "~/components/ui/separator";

import { api } from "~/utils/api";

const formSchema = z.object({
  name: z.string().min(2),
  accounts: z.array(
    z.object({
      id: z.string(),
      type: z.string(),
      provider: z.string(),
      session_state: z.string().nullish(),
    })
  ),
});

type UserFormValues = z.infer<typeof formSchema>;

type ExtendedUser = User & {
  accounts: Account[];
  sessions: Session[];
};

type ExtendedAccount = Account & {
  user: User;
};
interface UserFormProps {
  initialData: ExtendedUser | null;
}

export const UserForm: React.FC<UserFormProps> = ({ initialData }) => {
  const params = useRouter();
  const router = useNavigationRouter();
  const utils = api.useContext();

  const { data: accounts } = api.user.getAllAccounts.useQuery() ?? [];

  const [open, setOpen] = useState<boolean>(false);
  const [openAccounts, setOpenAccounts] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const title = initialData ? "Edit user" : "Create user";
  const description = initialData ? "Edit a user." : "Add a new user";
  const toastMessage = initialData ? "User updated." : "User created.";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<UserFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData?.name ?? "",
      accounts: initialData?.accounts ?? [],
    },
  });

  const { fields, remove } = useFieldArray({
    control: form.control,
    name: "accounts",
  });

  const { mutate: patchUser } = api.user.updateUser.useMutation({
    onSuccess: () => {
      router.push(`/admin/users`);
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
      void utils.user.getUser.invalidate();
    },
  });

  const { mutate: deleteUser } = api.user.deleteUser.useMutation({
    onSuccess: () => {
      router.push(`/admin/users`);
      toast.success("User deleted.");
    },
    onError: (error) => {
      toast.error("Make sure you removed all accounts using this user first.");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: () => {
      setLoading(false);
      setOpen(false);
      void utils.user.getAllUsers.invalidate();
    },
  });

  const onSubmit = (data: UserFormValues) => {
    if (initialData) {
      patchUser({
        id: params?.query?.userId as string,
        name: data.name,
      });
    }
  };

  const onDelete = () => {
    deleteUser({
      id: params?.query?.userId as string,
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
          <div className="gap-8 md:grid md:grid-cols-3">
            <FormField
              control={form.control}
              name="name"
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

            <div>
              <FormLabel className="text-lg">Active Accounts</FormLabel>
              <ScrollArea className="mt-5 flex max-h-96 flex-col space-y-4 bg-slate-50 p-2 shadow-inner">
                {fields.map((item, index) => {
                  return (
                    <div
                      className="my-1 flex flex-col space-y-2 "
                      key={item.id}
                    >
                      <Controller
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Account</FormLabel>
                            <div className="flex gap-2">
                              <Input
                                disabled
                                {...field}
                                className="capitalize"
                              />
                              <Button
                                onClick={() => remove(index)}
                                variant="destructive"
                                className="flex-grow"
                                type="button"
                                disabled
                              >
                                <Trash /> Remove
                              </Button>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                        name={`accounts.${index}.provider`}
                        control={form.control}
                        defaultValue={item.provider}
                      />
                    </div>
                  );
                })}
              </ScrollArea>

              <DropdownMenu>
                <DropdownMenuTrigger asChild disabled>
                  <Button variant="outline">Link Accounts (WIP)</Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="relative w-56 ">
                  {" "}
                  <DropdownMenuLabel>All Active Accounts</DropdownMenuLabel>
                  <ScrollArea className="flex  max-h-96 flex-col">
                    <DropdownMenuSeparator />
                    {accounts?.map((account: Account, idx) => (
                      <DropdownMenuCheckboxItem
                        key={idx}
                        className="flex flex-col items-start"
                        checked={
                          account.userId === initialData?.id ||
                          form
                            .getValues(`accounts`)
                            .map((account) => account.id)
                            .includes(account.id)
                        }
                        onCheckedChange={(value) => {
                          const temp = form
                            .getValues(`accounts`)
                            .filter((a) => a.id !== account.id);

                          if (value) temp.push(account);

                          form.setValue(`accounts`, temp);
                        }}
                      >
                        <p className="text-sm capitalize">{account.provider}</p>
                        <p className="text-xs text-muted-foreground">
                          {(account as ExtendedAccount)?.user?.name} --{" "}
                          {(account as ExtendedAccount)?.user?.email}
                        </p>
                      </DropdownMenuCheckboxItem>
                    ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>

              <CommandDialog open={openAccounts} onOpenChange={setOpenAccounts}>
                <CommandInput
                  placeholder="Type a command or search..."
                  className="border-0"
                />
                <CommandList>
                  <CommandEmpty>No results found.</CommandEmpty>
                  <CommandGroup heading="Suggestions">
                    <CommandItem>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      <span>Calendar</span>
                    </CommandItem>
                    <CommandItem>
                      <FaceIcon className="mr-2 h-4 w-4" />
                      <span>Search Emoji</span>
                    </CommandItem>
                    <CommandItem>
                      <RocketIcon className="mr-2 h-4 w-4" />
                      <span>Launch</span>
                    </CommandItem>
                  </CommandGroup>
                  <CommandSeparator />
                  <CommandGroup heading="Settings">
                    <CommandItem>
                      <PersonIcon className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                      <CommandShortcut>⌘P</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <EnvelopeClosedIcon className="mr-2 h-4 w-4" />
                      <span>Mail</span>
                      <CommandShortcut>⌘B</CommandShortcut>
                    </CommandItem>
                    <CommandItem>
                      <GearIcon className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                      <CommandShortcut>⌘S</CommandShortcut>
                    </CommandItem>
                  </CommandGroup>
                </CommandList>
              </CommandDialog>
            </div>
          </div>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
