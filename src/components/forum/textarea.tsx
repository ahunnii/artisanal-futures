import * as React from "react";
import { classNames } from "~/utils/styles";

export type TextareaOwnProps = {
  label?: string;
};

type TextareaProps = TextareaOwnProps &
  React.ComponentPropsWithoutRef<"textarea">;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, id, name, className, ...rest }, forwardedRef) => {
    return (
      <div>
        {label && (
          <label htmlFor={id ?? name} className="mb-2 block font-semibold">
            {label}
          </label>
        )}
        <textarea
          {...rest}
          ref={forwardedRef}
          id={id ?? name}
          name={name}
          className={classNames(
            "focus-ring border-forum-secondary block w-full rounded bg-forum-secondary shadow-sm",
            className
          )}
        />
      </div>
    );
  }
);

Textarea.displayName = "Textarea";
