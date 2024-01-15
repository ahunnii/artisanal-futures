/* eslint-disable @next/next/no-img-element */
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Settings } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import MainNav from "~/components/main-nav";
import NavbarActions from "~/components/navbar-actions";
import { Button } from "~/components/ui/button";
import Container from "~/components/ui/container";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

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

  return (
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

          {/* {categories && (
            <MainNav data={categories} className="hidden lg:block" />
          )} */}

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
            <Dialog>
              <DialogTrigger asChild>
                <Button variant={"ghost"} aria-label="Settings">
                  <Settings />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Solidarity Pathways Settings</DialogTitle>
                  <DialogDescription>
                    Add and modify your driver data, realtime settings, and
                    more.
                  </DialogDescription>
                </DialogHeader>

                <div className="w-full space-y-8 rounded-md border border-border bg-background/50 p-4">
                  <div>
                    <h4 className="font-semibold">Data Cache</h4>
                    <p className="text-muted-foreground">
                      Handles how driver and stop data is cached (i.e. stored
                      for later use)
                    </p>
                  </div>

                  <Button
                    onClick={() => {
                      sessionStorage.removeItem("stop-storage");
                      sessionStorage.removeItem("driver-storage");
                    }}
                  >
                    Clear Cache
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </>
    </div>
  );
};

export default Navbar;
