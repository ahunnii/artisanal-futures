import { cva, type VariantProps } from "class-variance-authority";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/styles";

const messageVariants = cva("", {
  variants: {
    variant: {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      destructive:
        "bg-destructive text-destructive-foreground hover:bg-destructive/90",
      outline:
        "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      link: "text-primary underline-offset-4 hover:underline",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
});

export const Message = ({
  content,
  time,
  type,
}: {
  content: string;
  time: string;
  type: "sender" | "receiver";
}) => {
  return (
    <>
      <div
        className={cn(
          "flex items-start gap-4",
          type === "sender" && "ml-auto items-end"
        )}
      >
        <div className="relative h-12 w-12">
          {type === "receiver" && (
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          )}
        </div>
        <div
          className={cn(
            "flex max-w-[60vw] flex-1 flex-col gap-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-950 lg:max-w-[22vw]",
            type === "receiver" && "max-w-[60vw] lg:max-w-[22vw]"
          )}
        >
          <p>{content}</p>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            {time}
          </time>
        </div>
      </div>
      {/* <div className="flex items-end gap-4">
        <div className="flex-1" />
        <div className="relative h-12 w-12">
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-950">
          <p>I'm doing great, thanks for asking! How about you?</p>
          <time className="text-sm text-gray-500 dark:text-gray-400">
            Just now
          </time>
        </div>
      </div> */}
    </>
  );
};
