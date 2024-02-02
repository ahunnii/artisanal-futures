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

import { ScrollArea } from "~/components/ui/scroll-area";
import type { ClientJobBundle, DriverVehicleBundle } from "../types.wip";
import { UploadOptions } from "./homepage-onboarding.wip";

type Bundle = {
  name: string;
  address: {
    formatted: string;
  };
};

export const FileUploadPreviewModal = ({
  open,
  setOpen,
  loading,
  bundles,
  handleAccept,
  handleClear,
  type,
}: UploadOptions) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="capitalize">{type} Import</DialogTitle>
          <DialogDescription>Here are the {type}s we found.</DialogDescription>
        </DialogHeader>
        <div className="flex  gap-4  ">
          <div className="flex w-1/3 flex-col ">
            <p className="text-lg font-semibold">Name</p>
          </div>
          <div className="flex w-2/3 flex-col ">
            <p className="text-lg font-semibold">Address</p>
          </div>
        </div>
        <ScrollArea className="grid h-96 w-full gap-4">
          {bundles.map((bundle: ClientJobBundle | DriverVehicleBundle, idx) => {
            return (
              <div className="flex  gap-4 p-4 odd:bg-muted" key={idx}>
                <div className="flex w-1/3 flex-col">
                  <p className="capitalize">
                    {type in bundle &&
                      type == "driver" &&
                      (bundle as DriverVehicleBundle)[type].name}
                    {type in bundle &&
                      type == "client" &&
                      (bundle as ClientJobBundle)[type].name}
                  </p>
                </div>
                <div className="flex w-2/3 flex-col">
                  <p>
                    {type in bundle &&
                      type == "driver" &&
                      (bundle as DriverVehicleBundle)[type].address.formatted}
                    {type in bundle &&
                      type == "client" &&
                      (bundle as ClientJobBundle)[type]?.address?.formatted}
                  </p>
                </div>
              </div>
            );
          })}
        </ScrollArea>
        <DialogFooter>
          <Button
            type="button"
            onClick={handleClear}
            disabled={loading}
            variant="outline"
          >
            Clear
          </Button>
          <Button type="button" onClick={handleAccept} disabled={loading}>
            {loading && <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />}
            Look&apos;s good, save them
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
