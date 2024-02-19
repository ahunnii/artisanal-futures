import type { User } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";
import { CellAction } from "./cell-action";
import InviteNewUser from "./invite-new-user";

interface UserClientProps {
  data: User[];
}

// Originally I had this separate, but for some reason, the select checkboxes were not showing. So I moved it here.
const columns: ColumnDef<User>[] = [
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
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => <div className="capitalize">{row.getValue("role")}</div>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <CaretSortIcon className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="lowercase">{row.getValue("email")}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="capitalize">{row.getValue("name")}</div>,
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const UserClient: React.FC<UserClientProps> = ({ data }) => {
  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Users (${data.length})`}
          description="Manage users for AF"
        />

        <InviteNewUser />
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
    </>
  );
};
