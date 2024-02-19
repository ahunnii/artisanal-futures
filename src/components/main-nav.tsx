"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// import type { Category } from "~/types";
import { cn } from "~/utils/styles";

interface MainNavProps extends React.HTMLAttributes<HTMLDivElement> {
  data: {
    id: string;
    name: string;
  }[];
}

const MainNav: React.FC<MainNavProps> = ({ data, className }) => {
  const pathname = usePathname();

  const routes = data.map((route) => ({
    href: `/${route.id}`,
    label: route.name,
    active: pathname === `/${route.id}`,
  }));

  return (
    <nav
      className={cn("mx-6 flex items-center space-x-4 lg:space-x-6", className)}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-lg font-medium transition-colors hover:text-black lg:text-sm ",
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
