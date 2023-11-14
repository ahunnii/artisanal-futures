import Link from "next/link";
import * as React from "react";
import { GithubLogo, HeartFilledIcon } from "~/components/forum/icons";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm text-forum-secondary md:flex-row md:gap-4">
      <p className="text-center text-sm text-black">
        &copy; 2023 Artisanal Futures. All rights reserved.
      </p>
    </footer>
  );
}
