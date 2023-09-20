import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

import Link from "next/link";

import { useEffect, useState } from "react";

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

        <Link href="/sign-in">Sign In</Link>
      </SignedOut>
    </div>
  );
};

export default NavbarActions;
