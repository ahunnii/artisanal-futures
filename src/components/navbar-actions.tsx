import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from "@clerk/nextjs";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "~/components/ui/button";
// import useCart from "~/hooks/app/use-cart";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <div className="ml-auto flex items-center gap-x-4">
      <SignedIn>
        {/* Mount the UserButton component */}
        <UserButton
          afterSignOutUrl="/"
          userProfileUrl="/profile"
          userProfileMode="navigation"
        />
      </SignedIn>
      <SignedOut>
        {/* Signed out users get sign in button */}
        {/* <SignInButton /> */}
        <Link href="/sign-in">Sign In</Link>
      </SignedOut>
    </div>
  );
};

export default NavbarActions;
