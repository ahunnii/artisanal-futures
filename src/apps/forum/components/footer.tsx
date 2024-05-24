import * as React from "react";

export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="flex flex-col items-center justify-between gap-2 text-sm text-forum-secondary md:flex-row md:gap-4">
      <p className="text-center text-sm text-black">
        &copy; {year} Artisanal Futures. All rights reserved.
      </p>
    </footer>
  );
}
