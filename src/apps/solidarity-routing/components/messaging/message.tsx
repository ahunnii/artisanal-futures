import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { cn } from "~/utils/styles";

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
            "flex max-w-[60vw] flex-1 flex-col gap-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-950",
            type === "receiver" && "max-w-[60vw]"
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
