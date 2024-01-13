import { useRouter as useNavigationRouter } from "next/navigation";
import { useState } from "react";

import type { User } from "@prisma/client";
import { Briefcase, Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { toast } from "react-hot-toast";

import { AlertModal } from "~/apps/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { api } from "~/utils/api";

interface CellActionProps {
  data: User;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useNavigationRouter();
  const utils = api.useContext();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: deleteUser } = api.user.deleteUser.useMutation({
    onSuccess: () => toast.success("User deleted."),
    onError: (error) => {
      toast.error("Make sure you removed all products using this color first.");
      console.error(error);
    },
    onMutate: () => setLoading(true),
    onSettled: async () => {
      setLoading(false);
      setOpen(false);
      await utils.user.getAllUsers.invalidate();
    },
  });

  const onConfirm = () => deleteUser({ id: data.id });

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("User ID copied to clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy user ID to clipboard.");
      });
  };

  const { mutate: updateRole } = api.user.updateUserRole.useMutation({
    onSuccess: async () => {
      await utils.user.getAllUsers.invalidate();
      toast.success("Role updated.");
    },
    onError: (error) => {
      toast.error("Something went wrong");
      console.error(error);
    },
  });

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onConfirm}
        loading={loading}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => onCopy(data.id)}>
            <Copy className="mr-2 h-4 w-4" /> Copy Id
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {" "}
              <Briefcase className="mr-2 h-4 w-4" />
              Role
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuRadioGroup value={data.role}>
                <DropdownMenuRadioItem
                  value={"USER"}
                  onClick={() => updateRole({ role: "USER", id: data.id })}
                >
                  User
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value={"ARTISAN"}
                  onClick={() => updateRole({ role: "ARTISAN", id: data.id })}
                >
                  Artisan
                </DropdownMenuRadioItem>{" "}
                <DropdownMenuRadioItem
                  value={"ADMIN"}
                  onClick={() => updateRole({ role: "ADMIN", id: data.id })}
                >
                  Admin
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>
            </DropdownMenuSubContent>
          </DropdownMenuSub>{" "}
          <DropdownMenuItem
            onClick={() => router.push(`/admin/users/${data.id}`)}
          >
            <Edit className="mr-2 h-4 w-4" /> Update
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <Trash className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
