import { ArrowLeftSquare } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";
import { useState, type ReactNode } from "react";

import { ButtonLink } from "~/components/forum/button-link";

import { Footer } from "~/components/forum/footer";
import { IconButton } from "~/components/forum/icon-button";
import { SearchIcon } from "~/components/forum/icons";

import { SearchDialog } from "~/components/forum/search-dialog";
import UserNav from "~/components/ui/user-nav";

type LayoutProps = {
  children: ReactNode;
};

const ForumLayout = ({ children }: LayoutProps) => {
  const [isSearchDialogOpen, setIsSearchDialogOpen] = useState(false);

  return (
    <main className="light flex min-h-screen flex-col bg-forum-primary">
      <div className=" flex h-full w-full flex-grow flex-row items-stretch p-8  ">
        <div className="mx-auto w-full  max-w-7xl  px-6">
          <header className="flex items-center justify-between gap-4 py-12 md:py-20">
            <div className="flex flex-col gap-y-3">
              <Link href="/" className="flex  gap-x-2 ">
                <Image
                  src="/img/logo.png"
                  alt="Artisanal Futures logo"
                  width={230.85}
                  height={32}
                />
              </Link>{" "}
              <Link href="/forum" className="flex  gap-x-2 text-gray-900">
                <ArrowLeftSquare /> Back to Forums
              </Link>
            </div>
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

              <ButtonLink href="/forum/new">
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
};

export default ForumLayout;
