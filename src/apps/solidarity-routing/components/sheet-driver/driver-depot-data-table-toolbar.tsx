import { Cross2Icon } from "@radix-ui/react-icons";
import type { Table } from "@tanstack/react-table";

import { Button } from "~/components/ui/button";
import { DataTableFacetedFilter } from "~/components/ui/data-table-faceted-filter";
import { DataTableViewOptions } from "~/components/ui/data-table-view-options";
import { Input } from "~/components/ui/input";

import { types } from "~/apps/solidarity-routing/data/driver-filter-data";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DriverDepotDataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex flex-col space-y-2">
      <div className="flex w-full items-center gap-2">
        <Input
          placeholder="Search drivers..."
          value={
            (table.getColumn("driver_name")?.getFilterValue() as string) ?? ""
          }
          onChange={(event) =>
            table.getColumn("driver_name")?.setFilterValue(event.target.value)
          }
          className="flex-1"
        />

        <DataTableViewOptions table={table} />
      </div>
      <div className="flex w-full items-center justify-between ">
        {table.getColumn("driver_type") && (
          <DataTableFacetedFilter
            column={table.getColumn("driver_type")}
            title="Driver Type"
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
