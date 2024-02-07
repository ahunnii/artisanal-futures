import * as React from "react";
import { PatternFormat, type PatternFormatProps } from "react-number-format";
import { cn } from "~/utils/styles";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> &
  PatternFormatProps;

const FormattedNumericInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <PatternFormat
        type={type}
        className={cn(
          "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        getInputRef={ref}
        {...props}
      />
    );
  }
);
FormattedNumericInput.displayName = "FormattedNumericInput";

export { FormattedNumericInput };
