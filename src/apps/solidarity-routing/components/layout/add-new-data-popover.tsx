import { Plus, UserPlus } from "lucide-react";
import { Button } from "~/components/ui/button";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { ImportDriversButton } from "~/apps/solidarity-routing/components/overview/import-drivers-button";

import { PathwaySettingsButton } from "~/apps/solidarity-routing/components/overview/pathways-settings-button";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

export function AddNewDataPopover() {
  const { onSheetOpenChange } = useDriverVehicleBundles();

  const addSingleDriver = () => onSheetOpenChange(true);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="absolute bottom-8 right-8 h-20 w-20 rounded-full lg:hidden"
        >
          <Plus className="h-8 w-8" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-fit">
        <div className="">
          {/* <div className="space-y-2">
            <h4 className="font-medium leading-none">Quick Add</h4>
            <p className="text-sm text-muted-foreground">
              Add new data to the route & depot.
            </p>
          </div> */}
          <div className=" flex flex-col items-start bg-white  text-left">
            <Button
              className="mx-0 flex gap-2 px-0 "
              variant={"link"}
              onClick={addSingleDriver}
            >
              <UserPlus />
              Add Drivers
            </Button>
            <ImportDriversButton />

            <PathwaySettingsButton />
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
