import { Message as ChannelMessage } from "@prisma/client";
import { LucideIcon, Send } from "lucide-react";
import { AutoResizeTextArea } from "~/components/ui/auto-resize-textarea";
import { Button } from "~/components/ui/button";
import { Message } from "./message";

export const MessagingBody = ({
  messages,
  senderId,
  SenderIcon,
}: {
  messages: ChannelMessage[];
  senderId: string;
  SenderIcon?: LucideIcon;
}) => {
  return (
    <>
      <div className="flex flex-1 flex-col gap-4 bg-gray-100 p-4 dark:bg-gray-900">
        {messages?.map((message) => {
          return (
            <Message
              key={message.id}
              content={message.content}
              time={message.createdAt.toISOString()}
              type={message.memberId === senderId ? "sender" : "receiver"}
              Icon={SenderIcon}
            />
          );
        })}
        {/* <Message
          content="Hey! Just wanted to check in and see how you're doing."
          time="2 minutes ago"
          type="receiver"
        />

        <Message
          content="I'm doing great, thanks for asking! How about you?"
          time="Just now"
          type="sender"
        />

        <Message
          content={`JOB#csdetedfsfs...: I'm doing great, thanks for asking! How about you?`}
          time="Just now"
          type="sender"
        />

        <Message
          content="I'm doing great, thanks for asking! How about you?"
          time="Just now"
          type="sender"
        /> */}
      </div>
      {/* <div className="flex-shrink-0">
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
      </div> */}
    </>
  );
};
