import Link from "next/link";
import * as React from "react";
import { GithubLogo, HeartFilledIcon } from "~/components/forum/icons";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm text-primary md:flex-row md:gap-4">
      <div className="inline-flex items-center gap-1 text-sm">
        <span>Made with</span>
        <HeartFilledIcon className="h-4 w-4" />
        <span>
          by{" "}
          <Link
            href="https://planetscale.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary transition-colors hover:text-primary/70"
          >
            PlanetScale
          </Link>
        </span>
      </div>
      <Link
        href="https://github.com/planetscale/beam"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 text-sm text-primary transition-colors hover:text-primary/70"
      >
        <GithubLogo className="h-4 w-4" />
        <span>View on GitHub</span>
      </Link>
    </footer>
  );
}
