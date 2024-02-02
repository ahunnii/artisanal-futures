/* eslint-disable @next/next/no-img-element */
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Bomb, Building, Car, Map, Settings, Truck, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import MainNav from "~/components/main-nav";
import NavbarActions from "~/components/navbar-actions";
import { Button } from "~/components/ui/button";
import Container from "~/components/ui/container";
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
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { api } from "~/utils/api";

const Navbar = () => {
  const categories = [
    {
      id: "shops",
      name: "Shops",
    },
    {
      id: "products",
      name: "Products",
    },
    {
      id: "forum",
      name: "Forum",
    },
    {
      id: "tools",
      name: "Tools",
    },
  ];

  const [open, setOpen] = useState(false);
  const router = useRouter();
  const apiContext = api.useContext();

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

  const { mutate: deleteDrivers } =
    api.drivers.deleteAllDepotDrivers.useMutation({
      onSuccess: () => {
        toast.success("Drivers deleted!");
      },
      onError: (e) => {
        toast.error("There seems to be an issue with deleting your drivers.");
        console.log(e);
      },
      onSettled: () => {
        void apiContext.drivers.invalidate();
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

  const { mutate: deleteVehicles } =
    api.vehicles.deleteAllDepotVehicles.useMutation({
      onSuccess: () => {
        toast.success("Vehicles deleted!");
      },
      onError: (e) => {
        toast.error("There seems to be an issue with deleting your vehicles.");
        console.log(e);
      },
      onSettled: () => {
        void apiContext.vehicles.invalidate();
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

  return (
    <>
      <div className="border-b">
        <>
          <div className="relative flex h-16 items-center px-4 sm:px-6 lg:px-8">
            <Link href="/" className=" flex items-center gap-x-2 lg:ml-0">
              <Image
                className=" block  h-5 lg:hidden"
                src="/img/logo_mobile.png"
                alt="Artisanal Futures logo"
                width={20}
                height={20}
              />

              <span className="hidden items-center gap-1 lg:flex">
                <Image
                  className=" block  h-5 "
                  src="/img/logo_mobile.png"
                  alt="Artisanal Futures logo"
                  width={20}
                  height={20}
                />
                <p className="font-normal text-black">
                  Artisanal Futures Solidarity Pathways
                </p>
              </span>
            </Link>

            <div className="ml-auto flex items-center space-x-6">
              <NavbarActions />
              <Sheet>
                <SheetTrigger asChild className="block lg:hidden">
                  <HamburgerMenuIcon className="h-5 w-5" />
                </SheetTrigger>
                <SheetContent side={"right"}>
                  <SheetHeader>
                    <SheetTitle>
                      {" "}
                      <Link
                        href="/"
                        className=" flex items-center gap-x-2 lg:ml-0"
                      >
                        <img
                          className=" block h-5 w-auto"
                          src="/img/logo.png"
                          alt="Artisanal Futures logo"
                        />
                      </Link>
                    </SheetTitle>
                  </SheetHeader>

                  <div className="radix-dialog-content flex w-full flex-col">
                    {categories && (
                      <MainNav
                        data={categories}
                        className="mx-0 flex flex-col items-baseline space-y-8 pt-8"
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Button
                variant={"ghost"}
                aria-label="Settings"
                onClick={() => setOpen(true)}
              >
                <Settings />
              </Button>
            </div>
          </div>
        </>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        {/* <DialogTrigger asChild></DialogTrigger> */}
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
                  <h4 className="font-semibold">Drivers and Clients</h4>
                  <p className="text-muted-foreground">
                    Decide on what you want to do with your saved drivers and
                    clients.
                  </p>
                </div>

                <div className="flex gap-4">
                  <Button
                    variant={"destructive"}
                    className="flex items-center gap-2"
                    onClick={() => {
                      deleteDrivers({ depotId: 1 });
                    }}
                  >
                    <Truck className="h-4 w-4" />
                    Nuke Drivers
                  </Button>

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
                    variant={"destructive"}
                    className="flex items-center gap-2"
                    onClick={() => {
                      deleteVehicles({ depotId: 1 });
                    }}
                  >
                    <Car className="h-4 w-4" />
                    Nuke Vehicles
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
                      deleteDrivers({ depotId: 1 });
                      deleteClients({ depotId: 1 });
                      deleteVehicles({ depotId: 1 });
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
    </>
  );
};

export default Navbar;
