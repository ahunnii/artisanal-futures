import * as React from "react";
import { GithubLogo, HeartFilledIcon } from "~/components/forum/icons";

export function Footer() {
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm text-secondary md:flex-row md:gap-4">
      <div className="inline-flex items-center gap-1 text-sm">
        <span>Made with</span>
        <HeartFilledIcon className="h-4 w-4" />
        <span>
          by{" "}
          <a
            href="https://planetscale.com"
            target="_blank"
            rel="noreferrer noopener"
            className="text-secondary transition-colors hover:text-primary"
          >
            PlanetScale
          </a>
        </span>
      </div>
      <a
        href="https://github.com/planetscale/beam"
        target="_blank"
        rel="noreferrer noopener"
        className="inline-flex items-center gap-2 text-sm text-secondary transition-colors hover:text-primary"
      >
        <GithubLogo className="h-4 w-4" />
        <span>View on GitHub</span>
      </a>
    </footer>
  );
}
