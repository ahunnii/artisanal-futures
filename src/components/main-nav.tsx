"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// import type { Category } from "~/types";
import { cn } from "~/utils/styles";

interface MainNavProps {
  data: {
    id: string;
    name: string;
  }[];
}

const MainNav: React.FC<MainNavProps> = ({ data }) => {
  const pathname = usePathname();

  const routes = data.map((route) => ({
    href:
      route.name === "Forums"
        ? "https://artisanal-futures-forum.vercel.app/"
        : `/${route.id}`,
    label: route.name,
    active: pathname === `/${route.id}`,
  }));

  return (
    <nav className="mx-6 flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          target={route.label === "Forums" ? "_blank" : ""}
          className={cn(
            "text-sm font-medium transition-colors hover:text-black",
            route.active ? "text-black" : "text-neutral-500"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
};

export default MainNav;
