import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { DataTableFacetedFilter } from "~/components/ui/data-table-faceted-filter";
import { DataTableViewOptions } from "~/components/ui/data-table-view-options";
import { Input } from "~/components/ui/input";

import { types } from "~/apps/solidarity-routing/data/job-filter-data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}
export function JobDepotDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex w-full items-center gap-2">
        <Input
          placeholder="Search jobs addresses..."
          value={
            (table.getColumn("job_address")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("job_address")?.setFilterValue(event.target.value)
          }
          className="flex-1"
        />

        <DataTableViewOptions table={table} />
      </div>
      <div className="flex w-full items-center justify-between ">
        {table.getColumn("job_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("job_type")}
            title="Job Type"
            options={types}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
}
