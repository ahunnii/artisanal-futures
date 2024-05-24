import type { FC } from "react";
import { cn } from "~/utils/styles";

type Props = {
  children: React.ReactNode;
  title: string;
  description?: string;
  bodyClassName?: string;
  titleClassName?: string;
} & React.HTMLAttributes<HTMLDivElement>;

export const ViewSection: FC<Props> = ({
  children,
  title,
  description,
  className,
  bodyClassName,
  titleClassName,
  ...props
}) => {
  return (
    <div
      className={cn(
        "w-full rounded-md border border-border bg-background/50 p-4",
        className
      )}
      {...props}
    >
      <h3
        className={cn(
          "scroll-m-20 pb-4 text-2xl font-semibold tracking-tight",
          description && "pb-1",
          titleClassName
        )}
      >
        {title}
      </h3>

      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}

      <div className={cn("mt-5", bodyClassName)}>{children}</div>
    </div>
  );
};
