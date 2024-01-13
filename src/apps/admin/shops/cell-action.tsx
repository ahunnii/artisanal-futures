import { Copy, Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { AlertModal } from "~/apps/admin/modals/alert-modal";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { api } from "~/utils/api";
// import type { ColorColumn } from "./columns";
import type { Shop } from "@prisma/client";

interface CellActionProps {
  data: Shop;
}

export const CellAction: React.FC<CellActionProps> = ({ data }) => {
  const router = useNavigationRouter();
  const utils = api.useContext();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { mutate: deleteShop } = api.shops.deleteShop.useMutation({
    onSuccess: () => {
      toast.success("Shop deleted.");
    },
    onError: (error) => {
      toast.error("There was an error in deleting the shop. Try again later.");
      console.error(error);
    },
    onMutate: () => {
      setLoading(true);
    },
    onSettled: async () => {
      setLoading(false);
      setOpen(false);
      await utils.shops.getAllShops.invalidate();
    },
  });

  const onConfirm = () => {
    deleteShop({
      shopId: data.id,
    });
  };

  const onCopy = (id: string) => {
    navigator.clipboard
      .writeText(id)
      .then(() => {
        toast.success("Shop ID copied to clipboard.");
      })
      .catch(() => {
        toast.error("Failed to copy shop ID to clipboard.");
      });
  };

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

          <DropdownMenuItem
            onClick={() => router.push(`/admin/shops/${data.id}`)}
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
