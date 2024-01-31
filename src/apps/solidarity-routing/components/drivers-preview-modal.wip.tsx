import { ReloadIcon } from "@radix-ui/react-icons";
import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

import type { DriverVehicleBundle } from "../types.wip";

export const DriversPreviewModal = ({
  open,
  setOpen,
  loading,
  driverVehicleBundles,
  handleAcceptDrivers,
  handleClear,
}: {
  open: boolean;
  loading: boolean;
  setOpen: (open: boolean) => void;
  driverVehicleBundles: DriverVehicleBundle[];
  handleAcceptDrivers: () => void;
  handleClear: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="w-3/4">
        <DialogHeader>
          <DialogTitle>Driver Import</DialogTitle>
          <DialogDescription>Here are the drivers we found.</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {driverVehicleBundles.map((driverVehicleBundle, idx) => (
            <div className="flex  gap-4" key={idx}>
              <div className="flex w-1/3 flex-col space-y-2">
                <p className="">Name</p>
                <p>{driverVehicleBundle.driver.name}</p>
              </div>
              <div className="flex w-2/3 flex-col space-y-2">
                <p className="">Address</p>
                <p>{driverVehicleBundle.driver.address.formatted}</p>
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleClear}
            disabled={loading}
            variant="outline"
          >
            Clear and try again
          </Button>
          <Button
            type="button"
            onClick={handleAcceptDrivers}
            disabled={loading}
          >
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Look&apos;s good, save them
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
