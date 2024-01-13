import Image from "next/image";
import Link from "next/link";

import { MainNav } from "~/apps/admin/main-nav";
import UserNav from "~/components/ui/user-nav";

const Navbar = () => {
  return (
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
        <p className="ml-1 text-base font-medium">Admin</p>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
