/* eslint-disable @next/next/no-img-element */

import { Bomb, Building, Car, Map, Settings, Truck, User } from "lucide-react";

import { useRouter } from "next/router";
import { ReactNode, useState } from "react";
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

import { useDepotModal } from "../../hooks/depot/use-depot-modal.wip";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";
import { DepotModal } from "./depot-modal";

export const PathwaysSettingsMenu = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const apiContext = api.useContext();
  const onOpen = useDepotModal((state) => state.onOpen);
  const driverBundles = useDriverVehicleBundles();

  const { depotId } = useSolidarityState();

  const { mutate: deleteClients } =
    api.clients.deleteAllDepotClients.useMutation({
      onSuccess: () => {
        toast.success("Clients deleted!");
      },
      onError: (e) => {
        toast.error("There seems to be an issue with deleting your clients.");
        console.log(e);
      },
      onSettled: () => {
        void apiContext.clients.invalidate();
      },
    });

  const { mutate: deleteJobs } = api.jobs.deleteAllDepotJobs.useMutation({
    onSuccess: () => {
      toast.success("Jobs deleted!");
    },
    onError: (e) => {
      toast.error("There seems to be an issue with deleting your jobs.");
      console.log(e);
    },
    onSettled: () => {
      void apiContext.jobs.invalidate();
    },
  });

  const { mutate: deleteAddresses } =
    api.addresses.deleteAllDepotAddresses.useMutation({
      onSuccess: () => {
        toast.success("Addresses deleted!");
      },
      onError: (e) => {
        toast.error("There seems to be an issue with deleting your addresses.");
        console.log(e);
      },
      onSettled: () => {
        void apiContext.addresses.invalidate();
      },
    });

  const getDepot = api.depots.getDepot.useQuery(
    {
      id: depotId,
    },
    {
      enabled: !!depotId && open,
    }
  );

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

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
        {/* <Button variant={"ghost"} aria-label="Settings">
          <Settings />
        </Button> */}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Solidarity Pathways Settings</DialogTitle>
          <DialogDescription>
            Add and modify your driver data, realtime settings, and more.
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="z-50 grid h-96 w-full gap-4">
          <div className="">
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
                  Set your depot defaults for drivers and stops, as well as
                  allow access to other AF users.
                </p>
              </div>
              <div className="flex gap-4">
                {getDepot?.data && (
                  <>
                    <DepotModal initialData={getDepot?.data ?? null} />
                    <Button onClick={() => onOpen()} className="w-full">
                      Edit Depot
                    </Button>
                  </>
                )}

                <Button
                  onClick={() => nukeMessaging()}
                  className="w-full"
                  variant={"destructive"}
                >
                  <Bomb /> Nuke Messaging
                </Button>
              </div>
            </div>
            <div className="flex w-full flex-col  space-y-8 rounded-md border border-border bg-background/50 p-4">
              <div>
                <h4 className="font-semibold">Drivers & Vehicles</h4>
                <p className="text-muted-foreground">
                  Decide on what you want to do with your saved drivers and
                  vehicles.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant={"destructive"}
                  className="flex flex-1 items-center gap-2"
                  onClick={driverBundles.deleteAllDrivers}
                >
                  <Truck className="h-4 w-4" />
                  Nuke Drivers
                </Button>

                <Button
                  variant={"destructive"}
                  className="flex flex-1 items-center gap-2"
                  onClick={driverBundles.deleteAllVehicles}
                >
                  <Car className="h-4 w-4" />
                  Nuke Vehicles
                </Button>
                <Button
                  variant={"destructive"}
                  className="flex flex-1 items-center gap-2"
                  onClick={driverBundles.deleteAll}
                >
                  <Car className="h-4 w-4" />
                  Nuke Both
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-col  space-y-8 rounded-md border border-border bg-background/50 p-4">
              <div>
                <h4 className="font-semibold">Vehicles and Jobs</h4>
                <p className="text-muted-foreground">
                  These are the profiles associated with your depot.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  className="flex items-center gap-2"
                  variant={"destructive"}
                  onClick={() => {
                    deleteClients({ depotId: 1 });
                  }}
                >
                  <User className="h-4 w-4" />
                  Nuke Clients
                </Button>

                <Button
                  className="flex items-center gap-2"
                  variant={"destructive"}
                  onClick={() => {
                    deleteJobs({ depotId: 1 });
                  }}
                >
                  <Building className="h-4 w-4" />
                  Nuke Jobs
                </Button>
              </div>
            </div>

            <div className="flex w-full flex-col  space-y-8 rounded-md border border-border bg-background/50 p-4">
              <div>
                <h4 className="font-semibold">Addresses</h4>
                <p className="text-muted-foreground">
                  These are the addresses associated with your depot.
                </p>
              </div>

              <div className="flex gap-4">
                <Button
                  variant={"destructive"}
                  className="flex items-center gap-2"
                  onClick={() => {
                    deleteAddresses({ depotId: 1 });
                  }}
                >
                  <Map className="h-4 w-4" />
                  Nuke Addresses
                </Button>
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

              <div className="flex gap-4">
                <Button
                  variant={"destructive"}
                  className="flex w-full items-center gap-2"
                  onClick={() => {
                    driverBundles.deleteAll();
                    deleteClients({ depotId: 1 });

                    deleteJobs({ depotId: 1 });
                    deleteAddresses({ depotId: 1 });
                  }}
                >
                  <Bomb className="h-4 w-4" />
                  Nuke EVERYTHING
                </Button>
              </div>
            </div>
          </div>
        </ScrollArea>
        <DialogFooter>
          {" "}
          <Button>Go back</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
