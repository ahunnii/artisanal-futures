import { Bomb, Truck, User } from "lucide-react";

import { useRouter } from "next/router";
import { useState, type ReactNode } from "react";
import toast from "react-hot-toast";

import { Button } from "~/components/ui/button";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { ScrollArea } from "~/components/ui/scroll-area";

import { api } from "~/utils/api";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";

import { DialogClose } from "@radix-ui/react-dialog";
import { useDepot } from "../../hooks/depot/use-depot";
import { useDepotModal } from "../../hooks/depot/use-depot-modal.wip";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";
import { AlertModal } from "../layout/alert-modal";
import { DepotModal } from "./depot-modal";

export const PathwaysSettingsMenu = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const { currentDepot, deleteDepot } = useDepot();
  const apiContext = api.useContext();
  const onOpen = useDepotModal((state) => state.onOpen);
  const driverBundles = useDriverVehicleBundles();

  const { depotId } = useSolidarityState();

  const { mutate: deleteClients } = api.jobs.deleteAllDepotClients.useMutation({
    onSuccess: () => {
      toast.success("Clients deleted!");
    },
    onError: (e) => {
      toast.error("There seems to be an issue with deleting your clients.");
      console.log(e);
    },
    onSettled: () => {
      void apiContext.jobs.invalidate();
    },
  });

  const { mutate: nukeMessaging } =
    api.routeMessaging.nukeEverything.useMutation({
      onSuccess: () => {
        toast.success("Messaging deleted!");
      },
      onError: (e) => {
        toast.error("There seems to be an issue with deleting your Messaging.");
        console.log(e);
      },
      onSettled: () => {
        void apiContext.routeMessaging.invalidate();
      },
    });

  const deleteCurrentDepot = () => {
    nukeMessaging();
    deleteDepot.mutate({ depotId });
  };

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="w-full max-w-2xl">
          <DialogHeader>
            <DialogTitle>Solidarity Pathways Settings</DialogTitle>
            <DialogDescription>
              Add and modify your driver data, realtime settings, and more.
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="z-50 grid h-96 w-full">
            <div className="flex flex-col space-y-4">
              <div className="flex w-full flex-col  space-y-8 rounded-md border border-border bg-background/50 p-4">
                <div>
                  <h4 className="font-semibold">Data Cache</h4>
                  <p className="text-muted-foreground">
                    Handles how driver and stop data is cached (i.e. stored for
                    later use)
                  </p>
                </div>

                <Button
                  onClick={() => {
                    sessionStorage.removeItem("stop-storage");
                    sessionStorage.removeItem("driver-storage");
                    router.reload();
                  }}
                >
                  Clear Cache
                </Button>
              </div>

              <div className="flex w-full flex-col  space-y-8 rounded-md border border-border bg-background/50 p-4">
                <div>
                  <h4 className="font-semibold">Depot</h4>
                  <p className="text-muted-foreground">
                    Edit your depot settings and details.
                  </p>
                </div>
                <div className="flex gap-4 max-md:flex-col">
                  {currentDepot && (
                    <>
                      <DepotModal initialData={currentDepot ?? null} />
                      <Button onClick={() => onOpen()} className="w-full">
                        Edit Depot
                      </Button>
                    </>
                  )}
                </div>
              </div>

              <div className="flex w-full flex-col  space-y-8 rounded-md border border-red-500 bg-red-500/5 p-4">
                <div>
                  <h4 className="font-semibold">Danger</h4>
                  <p className="text-muted-foreground">
                    This literally deletes everything in your depot. I hope you
                    know what you are doing...
                  </p>
                </div>

                <h4 className="font-semibold">Drivers & Clients</h4>

                <div className="flex gap-4 max-md:flex-col">
                  <AlertModal onContinue={driverBundles.deleteAllDrivers}>
                    <Button
                      variant={"destructive"}
                      className="flex flex-1 items-center gap-2"
                    >
                      <Truck className="h-4 w-4" />
                      Delete Drivers
                    </Button>
                  </AlertModal>
                  <AlertModal onContinue={() => deleteClients({ depotId })}>
                    <Button
                      className="flex flex-1 items-center gap-2"
                      variant={"destructive"}
                    >
                      <User className="h-4 w-4" />
                      Delete Clients
                    </Button>
                  </AlertModal>
                </div>

                <h4 className="font-semibold">Depot</h4>

                <AlertModal onContinue={deleteCurrentDepot}>
                  <Button
                    className="flex w-full items-center gap-2"
                    variant={"destructive"}
                  >
                    <Bomb className="h-4 w-4" /> Delete Depot
                  </Button>
                </AlertModal>
              </div>
            </div>
          </ScrollArea>
          <DialogFooter>
            <DialogClose>
              <Button>Close</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
