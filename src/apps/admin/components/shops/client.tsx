import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import type { Shop } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "~/components/ui/checkbox";

import { CellAction } from "./cell-action";
// import { columns } from "./columns";
interface ColorClientProps {
  data: Shop[];
}

const columns: ColumnDef<Shop>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "shopName",
    header: "Shop Name",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("shopName")}</div>
    ),
  },
  {
    accessorKey: "ownerId",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner Id
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("ownerId")}</div>
    ),
  },
  {
    accessorKey: "ownerName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Owner Name
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="lowercase">{row.getValue("ownerName")}</div>
    ),
  },
  {
    accessorKey: "website",
    header: "Website",
    cell: ({ row }) => <div>{row.getValue("website")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const ShopClient: React.FC<ColorClientProps> = ({ data }) => {
  const navigate = useNavigationRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Shops (${data.length})`}
          description="Manage new and existing shops for AF"
        />
        <Button onClick={() => navigate.push(`/admin/shops/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="shopName" columns={columns} data={data} />
    </>
  );
};
