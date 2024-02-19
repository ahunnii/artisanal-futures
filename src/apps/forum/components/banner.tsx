import * as React from "react";
import { classNames } from "~/utils/styles";

type BannerProps = {
  children: React.ReactNode;
  className?: string;
};

export function Banner({ children, className }: BannerProps) {
  return (
    <div
      className={classNames(
        "rounded border border-yellow-light bg-forum-yellow-light p-6 font-semibold leading-snug",
        className
      )}
    >
      {children}
    </div>
  );
}
