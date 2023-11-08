import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import { useRouter } from "next/router";

import { cn } from "~/utils/styles";

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const params = useParams();
  const router = useRouter();

  console.log();

  const routes = [
    {
      href: `/admin/`,
      label: "Overview",
      active: pathname === `/admin/`,
    },
    {
      href: `/admin/users`,
      label: "Users",
      active: pathname === `/admin/users`,
    },
  ];

  return (
    <nav
      className={cn("flex items-center space-x-4 lg:space-x-6", className)}
      {...props}
    >
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active
              ? "text-black dark:text-white"
              : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  );
}
