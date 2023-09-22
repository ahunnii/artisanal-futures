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
          "focus-ring inline-flex h-button w-icon-button flex-shrink-0 items-center justify-center rounded-full transition-colors",
          variant === "primary" &&
            "bg-forum-secondary-inverse text-forum-secondary-inverse hover:bg-forum-primary-inverse hover:text-forum-primary-inverse",
          variant === "secondary" &&
            "border border-forum-secondary bg-forum-primary text-forum-primary hover:bg-forum-secondary",
          className
        )}
      />
    );
  }
);

IconButton.displayName = "IconButton";
