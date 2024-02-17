import { type ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import * as React from "react";

import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import type { ClientJobBundle } from "../../types.wip";

const DeleteComponent = () =>
  // { row }: { row: ClientJobBundle }
  {
    // const jobs = useClientJobBundles();

    // const editPost = () => {
    //   // drivers.deleteFromDepot({
    //   //   driverId: row.driver.id,
    //   //   vehicleId: row.vehicle.id,
    //   // });
    // };

    return <p className="text-red-500 hover:text-red-400">Delete from Depot</p>;
  };

const EditComponent = ({ row }: { row: ClientJobBundle }) => {
  const jobs = useClientJobBundles();

  const editPost = (id: string) => {
    jobs.edit(id);
  };

  return <p onClick={() => editPost(row.job.id)}>Edit</p>;
};

export const columns: ColumnDef<ClientJobBundle>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
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
    accessorKey: "client.name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="capitalize">
        {row.original?.client?.name ?? "Unsaved Client"}
      </div>
    ),
  },

  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const job = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => void navigator.clipboard.writeText(job.job.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <EditComponent row={job} />
            </DropdownMenuItem>

            <DropdownMenuItem>
              {" "}
              <DeleteComponent />
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
