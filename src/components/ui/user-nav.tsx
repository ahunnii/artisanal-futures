import { ShieldCheck, Store, User } from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const UserNav = () => {
  const { data: sessionData } = useSession();
  const router = useRouter();
  if (!sessionData) {
    return (
      <>
        <Button
          onClick={sessionData ? () => void signOut() : () => void signIn()}
          variant={"ghost"}
          className="max-md:w-full"
        >
          Sign In
        </Button>
        <Button
          onClick={() => void router.push(`/sign-up`)}
          className="max-md:w-full"
        >
          Sign Up
        </Button>
      </>
    );
  } else
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={sessionData?.user?.image ?? ""}
                alt={`@${sessionData?.user?.name}`}
              />
              <AvatarFallback>
                <User />
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium leading-none">
                  {sessionData?.user?.name}{" "}
                </p>

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
              </div>
              <p className="text-xs leading-none text-muted-foreground">
                {sessionData?.user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Link href="/profile" className="w-full">
                Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/profile/shop" className="w-full">
                Shop
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Link href="/profile/survey" className="w-full">
                Survey
              </Link>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => void signOut()}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
};
export default UserNav;
