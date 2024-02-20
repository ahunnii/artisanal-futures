import Image from "next/image";
import Link from "next/link";

import NavbarActions from "~/components/navbar-actions";

import { Settings } from "lucide-react";
import { Button } from "~/components/ui/button";
import { PathwaysSettingsMenu } from "../settings/pathways-settings-menu.wip";
import { PathwaysNotifications } from "../ui/pathways-notifications";

const Navbar = () => {
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
              <PathwaysSettingsMenu>
                <Button variant={"ghost"} aria-label="Settings">
                  <Settings />
                </Button>
              </PathwaysSettingsMenu>
              <PathwaysNotifications />
              <NavbarActions />
            </div>
          </div>
        </>
      </div>
    </>
  );
};

export default Navbar;
