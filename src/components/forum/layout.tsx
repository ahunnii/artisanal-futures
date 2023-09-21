import { signOut, useSession } from "next-auth/react";
import { useTheme } from "next-themes";
import Link from "next/link";
import * as React from "react";
import { ReactNode, useState } from "react";
import { Avatar } from "~/components/forum/avatar";
import { ButtonLink } from "~/components/forum/button-link";
import { Footer } from "~/components/forum/footer";
import { IconButton } from "~/components/forum/icon-button";
import { Logo, SearchIcon } from "~/components/forum/icons";
import {
  Menu,
  MenuButton,
  MenuItemButton,
  MenuItemLink,
  MenuItems,
  MenuItemsContent,
} from "~/components/forum/menu";
import { SearchDialog } from "~/components/forum/search-dialog";
import { capitalize } from "~/utils/forum/text";
import UserNav from "../ui/user-nav";

type LayoutProps = {
  children: ReactNode;
};

export function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();
  // const { theme, themes, setTheme } = useTheme();
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  return (
    <main className="flex min-h-screen flex-col ">
      <div className=" flex h-full w-full flex-grow flex-row items-stretch bg-slate-800 p-8 ">
        <div className="mx-auto w-full  max-w-7xl  px-6">
          <header className="flex items-center justify-between gap-4 py-12 md:py-20">
            <Link href="/">
              <Logo className="text-red-light h-[34px] w-auto" />
            </Link>
            <div className="flex items-center gap-2 md:gap-4">
              <IconButton
                variant="secondary"
                onClick={() => {
                  setIsSearchDialogOpen(true);
                }}
              >
                <SearchIcon className="h-4 w-4" />
              </IconButton>
              <UserNav />

              <Menu>
                <MenuButton className="focus-ring group relative inline-flex rounded-full">
                  <Avatar
                    name={session?.user?.name ?? "Anonymous"}
                    src={session?.user?.image ?? ""}
                    size="sm"
                  />
                </MenuButton>

                <MenuItems className="w-48">
                  <MenuItemsContent>
                    <MenuItemLink href={`/profile/${session?.user.id}`}>
                      Profile
                    </MenuItemLink>
                    <MenuItemButton onClick={() => void signOut()}>
                      Log out
                    </MenuItemButton>
                  </MenuItemsContent>
                  {/* <div className="flex items-center gap-4 rounded-b bg-secondary px-4 py-3">
                <label htmlFor="theme" className="text-sm">
                  Theme
                </label>
                <select
                  id="theme"
                  name="theme"
                  value={theme}
                  onChange={(event) => {
                    setTheme(event.target.value);
                  }}
                  className="block w-full rounded border border-secondary bg-primary py-1.5 text-xs shadow-sm"
                >
                  {themes.map((theme) => (
                    <option key={theme} value={theme}>
                      {capitalize(theme)}
                    </option>
                  ))}
                </select>
              </div> */}
                </MenuItems>
              </Menu>

              <ButtonLink href="/new">
                <span className="sm:hidden">Post</span>
                <span className="hidden shrink-0 sm:block">New post</span>
              </ButtonLink>
            </div>
          </header>

          <main>{children}</main>

          <div className="py-20">
            <Footer />
          </div>

          <SearchDialog
            isOpen={isSearchDialogOpen}
            onClose={() => {
              setIsSearchDialogOpen(false);
            }}
          />
        </div>
      </div>
    </main>
  );
}
