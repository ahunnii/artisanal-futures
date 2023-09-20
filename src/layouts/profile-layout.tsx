import Head from "next/head";
import { useMemo } from "react";

import Body from "~/components/body";
import { SidebarNav } from "~/components/profile/sidebar-nav";
import { Separator } from "~/components/ui/separator";
import { api } from "~/utils/api";

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export default function ProfileLayout({ children }: SettingsLayoutProps) {
  const shop = api.shops.getCurrentUserShop.useQuery();

  const navItems = useMemo(() => {
    return [
      {
        title: "Profile",
        href: "/profile",
      },
      shop && shop.data
        ? {
            title: "Shop",
            href: "/profile/shop/" + shop.data.id,
          }
        : {
            title: "Shop",
            href: "/profile/shop",
          },
      {
        title: "Survey",
        href: "/profile/survey",
      },

      // {
      //   title: "Account",
      //   href: "/profile/account",
      // },
      // {
      //   title: "Appearance",
      //   href: "/profile/appearance",
      // },
      // {
      //   title: "Notifications",
      //   href: "/profile/notifications",
      // },
      // {
      //   title: "Display",
      //   href: "/profile/display",
      // },
    ];
  }, [shop]);

  return (
    <>
      <Head>
        <title>Profile | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Body>
        <div className=" block space-y-6 py-5 pb-16">
          <div className="space-y-0.5">
            <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
            <p className="text-muted-foreground">
              Manage your account settings and set e-mail preferences.
            </p>
          </div>
          <Separator className="my-6" />
          <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
            <aside className="-mx-4 lg:w-1/5">
              <SidebarNav items={navItems} />
            </aside>
            <div className="flex-1 lg:max-w-2xl">{children}</div>
          </div>
        </div>
      </Body>
    </>
  );
}
