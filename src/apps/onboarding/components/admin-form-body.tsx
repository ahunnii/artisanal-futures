import type { ElementRef, FC, HTMLAttributes } from "react";
import { cn } from "~/utils/styles";

type Props = HTMLAttributes<ElementRef<"section">>;

export const AdminFormBody: FC<Props> = ({ children, className, ...props }) => {
  return (
    <section
      className={cn(
        "mt-4 flex w-full  gap-4 space-y-8 p-8 max-lg:flex-col",
        className
      )}
      {...props}
    >
      {children}
    </section>
  );
};
