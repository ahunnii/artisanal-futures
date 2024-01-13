import * as React from "react";
import { SpinnerIcon } from "~/apps/forum/icons";
import { classNames } from "~/utils/styles";

export type ButtonVariant = "primary" | "secondary";

type ButtonProps = {
  variant?: ButtonVariant;
  responsive?: boolean;
  isLoading?: boolean;
  loadingChildren?: React.ReactNode;
} & React.ComponentPropsWithoutRef<"button">;

export function buttonClasses({
  className,
  variant = "primary",
  responsive,
  isLoading,
  disabled,
}: ButtonProps) {
  return classNames(
    "inline-flex items-center justify-center font-semibold transition-colors rounded-full focus-ring",
    responsive
      ? "px-3 h-8 text-xs sm:px-4 sm:text-sm sm:h-button"
      : "px-4 text-sm h-button",
    variant === "primary" &&
      "text-forum-secondary-inverse bg-forum-secondary-inverse hover:text-forum-primary-inverse hover:bg-forum-primary-inverse",
    variant === "secondary" &&
      "border text-forum-primary border-forum-secondary bg-forum-primary hover:bg-forum-secondary",
    (disabled ?? isLoading) && "opacity-50 cursor-default",
    className
  );
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      responsive,
      type = "button",
      isLoading = false,
      loadingChildren,
      disabled,
      children,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <button
        {...rest}
        ref={forwardedRef}
        type={type}
        disabled={disabled ?? isLoading}
        className={buttonClasses({
          className,
          disabled,
          variant,
          responsive,
          isLoading,
        })}
      >
        {isLoading && (
          <SpinnerIcon className="-ml-1 mr-2 h-4 w-4 animate-spin" />
        )}
        {isLoading && loadingChildren ? loadingChildren : children}
      </button>
    );
  }
);

Button.displayName = "Button";
