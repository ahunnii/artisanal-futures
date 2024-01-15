import Image from "next/image";
import Link from "next/link";

import { SearchIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import UserNav from "~/components/ui/user-nav";
import { SearchDialog } from "./search-dialog";

const Navbar = () => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);
  return (
    <>
      {" "}
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/" className=" flex items-center gap-x-2 lg:ml-0">
            <Image
              className=" block  h-5 lg:hidden"
              src="/img/logo_mobile.png"
              alt="Artisanal Futures logo"
              width={20}
              height={20}
            />
            <Image
              className="hidden h-5 w-auto lg:block"
              src="/img/logo.png"
              alt="Artisanal Futures logo"
              width={144}
              height={20}
            />
          </Link>
          <Link
            className="ml-1 hidden text-base font-medium md:block"
            href="/forum"
          >
            Forums
          </Link>
          {/* <MainNav className="mx-6" /> */}
          <Button
            onClick={() => {
              setIsSearchDialogOpen(true);
            }}
            variant={"secondary"}
            className="mx-auto w-3/5 justify-start gap-2 text-left"
          >
            {" "}
            <SearchIcon className="h-4 w-4" /> Search Forums
          </Button>
          <div className="ml-auto flex items-center space-x-4">
            <UserNav />
            {/* <Link href="/forum/new">
              <Button className="rounded-full">
                <span className="sm:hidden">Post</span>
                <span className="hidden shrink-0 sm:block">C post</span>
              </Button>
            </Link> */}
          </div>
        </div>
      </div>
      <SearchDialog
        isOpen={isSearchDialogOpen}
        onClose={() => {
          setIsSearchDialogOpen(false);
        }}
      />
    </>
  );
};

export default Navbar;
