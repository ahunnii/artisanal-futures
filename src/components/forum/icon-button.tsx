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
          "h-button w-icon-button focus-ring inline-flex flex-shrink-0 items-center justify-center rounded-full transition-colors",
          variant === "primary" &&
            "text-secondary-inverse bg-secondary-inverse hover:text-primary-inverse hover:bg-primary-inverse",
          variant === "secondary" &&
            "border border-secondary bg-primary text-primary hover:bg-secondary",
          className
        )}
      />
    );
  }
);

IconButton.displayName = "IconButton";
