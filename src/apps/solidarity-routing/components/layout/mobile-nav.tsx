import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ShieldCheck, Store, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import MainNav from "~/components/main-nav";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";

export const MobileNav = ({
  links,
}: {
  links: { id: string; name: string }[];
}) => {
  const { data: sessionData } = useSession();
  return (
    <Sheet>
      <SheetTrigger asChild className=" lg:hidden">
        <Button variant="ghost" size="icon">
          <HamburgerMenuIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side={"top"}>
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
        <Separator className="my-4" />
        <SheetFooter className="flex flex-row justify-center gap-2 ">
          {!sessionData?.user && (
            <>
              <Button className="flex-1" onClick={() => void signIn()}>
                Log in
              </Button>
              <Link href="/sign-up">
                <Button variant="secondary" className="flex-1">
                  Sign up
                </Button>
              </Link>
            </>
          )}

          {sessionData?.user && (
            <>
              <div className="flex w-full flex-row items-center justify-between pt-4">
                <Link href="/profile" className=" flex items-center gap-2 ">
                  <Avatar>
                    <AvatarImage
                      src={sessionData.user.image!}
                      alt={sessionData.user.name!}
                    />
                    <AvatarFallback>{sessionData.user.name}</AvatarFallback>
                  </Avatar>

                  <p className="flex flex-col ">
                    <span className="flex gap-1">
                      {sessionData?.user?.name}
                      <>
                        {sessionData?.user?.role == "USER" && (
                          <User className="w-[0.875rem] text-sm font-medium" />
                        )}
                      </>
                      <>
                        {sessionData?.user?.role == "ADMIN" && (
                          <ShieldCheck className="w-[0.875rem] text-sm font-medium" />
                        )}
                      </>
                      <>
                        {sessionData?.user?.role == "ARTISAN" && (
                          <Store className="w-[0.875rem] text-sm font-medium" />
                        )}
                      </>
                    </span>
                    <span>{sessionData?.user?.email}</span>
                  </p>
                </Link>

                <Button onClick={() => void signOut()} variant={"outline"}>
                  Not you? Sign out
                </Button>
              </div>
            </>
          )}
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
