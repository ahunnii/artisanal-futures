import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import Link from "next/link";
import MainNav from "~/components/main-nav";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export const MobileNav = ({
  links,
}: {
  links: { id: string; name: string }[];
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild className="block lg:hidden">
        <HamburgerMenuIcon className="h-5 w-5" />
      </SheetTrigger>
      <SheetContent side={"right"}>
        <SheetHeader>
          <SheetTitle>
            {" "}
            <Link href="/" className=" flex items-center gap-x-2">
              <span className=" flex items-center gap-1">
                <Image
                  className=" block  h-5 "
                  src="/img/logo_mobile.png"
                  alt="Artisanal Futures logo"
                  width={20}
                  height={20}
                />
                <p className=" font-normal text-black">Artisanal Futures</p>
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>

        <div className="radix-dialog-content flex w-full flex-col">
          {links && (
            <MainNav
              data={links}
              className="mx-0 flex flex-col items-baseline space-y-8 pt-8"
            />
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
};
