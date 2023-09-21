import Link, { type LinkProps } from "next/link";
import * as React from "react";
import { buttonClasses, type ButtonVariant } from "~/components/forum/button";

type ButtonLinkProps = {
  variant?: ButtonVariant;
  responsive?: boolean;
} & Omit<React.ComponentPropsWithoutRef<"a">, "href"> &
  LinkProps;

export const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
  (
    {
      href,
      as,
      replace,
      scroll,
      shallow,
      passHref,
      prefetch,
      locale,
      className,
      variant = "primary",
      responsive,
      ...rest
    },
    forwardedRef
  ) => {
    return (
      <Link
        href={href}
        as={as}
        replace={replace}
        scroll={scroll}
        shallow={shallow}
        passHref={passHref}
        prefetch={prefetch}
        locale={locale}
      >
        <span
          {...rest}
          ref={forwardedRef}
          className={buttonClasses({ className, variant, responsive })}
        />
      </Link>
    );
  }
);

ButtonLink.displayName = "ButtonLink";
