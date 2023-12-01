import { useEffect, useState } from "react";

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
    <div className="flex max-md:mt-auto max-md:w-full max-md:items-stretch max-md:justify-around lg:ml-auto lg:items-center lg:gap-x-4">
      <UserNav />
    </div>
  );
};

export default NavbarActions;
