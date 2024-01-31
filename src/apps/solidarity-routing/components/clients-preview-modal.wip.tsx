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
import type { ClientJobBundle } from "../types.wip";

export const ClientsPreviewModal = ({
  open,
  setOpen,
  loading,
  clientJobBundles,
  handleAcceptClients,
  handleClear,
}: {
  open: boolean;
  loading: boolean;
  setOpen: (open: boolean) => void;
  clientJobBundles: ClientJobBundle[];
  handleAcceptClients: () => void;
  handleClear: () => void;
}) => {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Client Import</DialogTitle>
          <DialogDescription>Here are the clients we found.</DialogDescription>
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
          {clientJobBundles.map((clientJobBundle, idx) => (
            <div className="flex  gap-4 p-4 odd:bg-muted" key={idx}>
              <div className="flex w-1/3 flex-col">
                <p className="capitalize">{clientJobBundle.client.name}</p>
              </div>
              <div className="flex w-2/3 flex-col">
                <p>{clientJobBundle.client.address.formatted}</p>
              </div>
            </div>
          ))}
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
          <Button
            type="button"
            onClick={handleAcceptClients}
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
