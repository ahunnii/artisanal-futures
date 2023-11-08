// import { UserButton, auth } from "@clerk/nextjs";
import { getSession, signIn, signOut } from "next-auth/react";
import { redirect, useParams } from "next/navigation";
import { MainNav } from "~/components/admin/main-nav";

import { prisma } from "~/server/db";

import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { api } from "~/utils/api";
import UserNav from "../ui/user-nav";
const Navbar = () => {
  // const validateUser = async () => {
  //   const session = await getSession();
  //   if (!session?.user) {
  //     redirect("/auth/signin");
  //   }
  // };

  // useEffect(() => {
  //   void validateUser();
  // }, []);

  return (
    <div className="border-b">
      <div className="flex h-16 items-center px-4">
        <Link href="/" className=" flex items-center gap-x-2 lg:ml-0">
          <Image
            className=" block  h-5 lg:hidden"
            src="/img/logo_mobile.png"
            alt="Artisanal Futures logo"
            width={20}
            height={20}
          />
          <Image
            className="hidden h-5 w-auto lg:block"
            src="/img/logo.png"
            alt="Artisanal Futures logo"
            width={144}
            height={20}
          />
        </Link>
        <p className="ml-1 text-base font-medium">Admin</p>
        <MainNav className="mx-6" />
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
          {/* <ThemeToggle /> */}
          {/* <UserButton afterSignOutUrl="/" /> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
