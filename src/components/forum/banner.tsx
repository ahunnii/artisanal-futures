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
        "bg-yellow-light border-yellow-light rounded border p-6 font-semibold leading-snug",
        className ?? ""
      )}
    >
      {children}
    </div>
  );
}
