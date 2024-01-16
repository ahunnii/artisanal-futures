import { Plus } from "lucide-react";
import { useRouter as useNavigationRouter } from "next/navigation";

import { Button } from "~/components/ui/button";
import { DataTable } from "~/components/ui/data-table";
import { Heading } from "~/components/ui/heading";
import { Separator } from "~/components/ui/separator";

import type { Survey } from "@prisma/client";
import { CaretSortIcon } from "@radix-ui/react-icons";
import type { ColumnDef } from "@tanstack/react-table";
import moment from "moment";
import { Checkbox } from "~/components/ui/checkbox";
import { CellAction } from "./cell-action";
// import { columns } from "./columns";
interface ColorClientProps {
  data: Survey[];
}

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
      <div className="capitalize">{row.getValue("shopId")}</div>
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
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => (
      <div>
        {moment(row.getValue("createdAt"))
          .local()
          .format("MM-DD-YYYY hh:mm:ss a")}
      </div>
    ),
  },
  {
    accessorKey: "updatedAt",
    header: "Updated At",
    cell: ({ row }) => (
      <div>
        {moment(row.getValue("updatedAt"))
          .local()
          .format("MM-DD-YYYY hh:mm:ss a")}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <CellAction data={row.original} />,
  },
];

export const SurveyClient: React.FC<ColorClientProps> = ({ data }) => {
  const navigate = useNavigationRouter();

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading
          title={`Surveys (${data.length})`}
          description="Manage new and existing surveys for AF"
        />
        <Button onClick={() => navigate.push(`/admin/shops/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="shopId" columns={columns} data={data} />
    </>
  );
};
