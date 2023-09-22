import * as React from "react";
import type { ButtonVariant } from "~/components/forum/button";
import { classNames } from "~/utils/styles";

export type IconButtonOwnProps = {
  variant?: ButtonVariant;
};

type IconButtonProps = IconButtonOwnProps &
  React.ComponentPropsWithoutRef<"button">;

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    { className, variant = "primary", type = "button", ...rest },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        className={classNames(
          "focus-ring inline-flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full transition-colors",
          variant === "primary" &&
            "bg-secondary/70 text-primary/70 hover:bg-primary/20 hover:text-primary/70",
          variant === "secondary" &&
            "border border-secondary bg-primary text-primary hover:bg-secondary",
          className
        )}
      />
    );
  }
);

IconButton.displayName = "IconButton";
