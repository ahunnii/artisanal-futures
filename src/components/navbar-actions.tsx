import { useEffect, useState } from "react";

import { MobileNav } from "~/apps/solidarity-routing/components/layout/mobile-nav";

import { useMediaQuery } from "~/hooks/use-media-query";
import UserNav from "./ui/user-nav";

const NavbarActions = () => {
  const [isMounted, setIsMounted] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const categories = [
    {
      id: "shops",
      name: "Shops",
    },
    {
      id: "products",
      name: "Products",
    },
    {
      id: "forum",
      name: "Forum",
    },
    {
      id: "tools",
      name: "Tools",
    },
  ];

  return (
    <div className="flex items-center gap-4 max-md:mt-auto max-md:w-full max-md:justify-around  lg:ml-auto lg:gap-x-4">
      {isDesktop && <UserNav />}
      <MobileNav links={categories} />
    </div>
  );
};

export default NavbarActions;
