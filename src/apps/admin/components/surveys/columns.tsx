import type { ColumnDef } from "@tanstack/react-table";

import type { Shop, Survey } from "@prisma/client";
import { Checkbox } from "@radix-ui/react-checkbox";
import { CaretSortIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import { CellAction } from "./cell-action";

export const columns: ColumnDef<Survey>[] = [
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
    accessorKey: "shopId",
    header: "Shop Id",
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
  // {
  //   accessorKey: "ownerName",
  //   header: ({ column }) => {
  //     return (
  //       <Button
  //         variant="ghost"
  //         onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
  //       >
  //         Owner Name
  //         <CaretSortIcon className="ml-2 h-4 w-4" />
  //       </Button>
  //     );
  //   },
  //   cell: ({ row }) => (
  //     <div className="lowercase">{row.getValue("ownerName")}</div>
  //   ),
  // },
  // {
  //   accessorKey: "website",
  //   header: "Website",
  //   cell: ({ row }) => <div>{row.getValue("website")}</div>,
  // },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];
