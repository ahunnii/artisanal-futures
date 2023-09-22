import { signIn } from "next-auth/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import UserNav from "./ui/user-nav";

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
      <UserNav />
    </div>
  );
};

export default NavbarActions;
