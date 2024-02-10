import { Send } from "lucide-react";
import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { Button } from "~/components/ui/button";
import { Message } from "./message";

export const MessagingBody = () => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 bg-gray-100 p-4 dark:bg-gray-900">
        <Message
          content="Hey! Just wanted to check in and see how you're doing."
          time="2 minutes ago"
          type="receiver"
        />

        <Message
          content="I'm doing great, thanks for asking! How about you?"
          time="Just now"
          type="sender"
        />

        {/* <div className="flex items-start gap-4">
          <div className="relative h-12 w-12">
            <img
              alt="Avatar"
              className="rounded-full object-cover"
              height="56"
              src="/placeholder.svg"
              style={{
                aspectRatio: "56/56",
                objectFit: "cover",
              }}
              width="56"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-950">
            <p>Hey! Just wanted to check in and see how you're doing.</p>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              2 minutes ago
            </time>
          </div>
        </div>
        <div className="flex items-end gap-4">
          <div className="flex-1" />
          <div className="relative h-12 w-12">
            <img
              alt="Avatar"
              className="rounded-full object-cover"
              height="56"
              src="/placeholder.svg"
              style={{
                aspectRatio: "56/56",
                objectFit: "cover",
              }}
              width="56"
            />
          </div>
          <div className="flex flex-1 flex-col gap-2 rounded-xl bg-white p-4 shadow-sm dark:bg-gray-950">
            <p>I'm doing great, thanks for asking! How about you?</p>
            <time className="text-sm text-gray-500 dark:text-gray-400">
              Just now
            </time>
          </div>
        </div> */}
      </div>
      <div className="flex-shrink-0">
        <form action="#" className="flex items-center gap-2 px-4">
          <AutoResizeTextArea
            className=""
            placeholder="Type a message"
            maxHeight={100}
          />
          <Button
            aria-label="Send"
            className="ml-auto"
            type="button"
            size="icon"
            variant={"ghost"}
          >
            <Send className="h-5 w-5" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </div>
    </>
  );
};
