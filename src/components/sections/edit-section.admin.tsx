import type { FC } from "react";
import { FormDescription, FormLabel } from "~/components/ui/form";
import { cn } from "~/utils/styles";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  headerClassName?: string;
  bodyClassName?: string;
  hasError?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const EditSection: FC<Props> = ({
  children,
  title,
  description,
  className,
  headerClassName,
  bodyClassName,
  hasError,
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-md border border-border bg-background/50 p-4 ",
        className
      )}
    >
      <div className={cn(headerClassName)}>
        <FormLabel className={cn("", hasError && "text-red-500")}>
          {title}
        </FormLabel>{" "}
        {description && <FormDescription>{description}</FormDescription>}
      </div>

      <div className={cn("mt-5", bodyClassName)}>{children}</div>
    </div>
  );
};
