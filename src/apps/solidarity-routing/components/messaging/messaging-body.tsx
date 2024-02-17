import type { Message as ChannelMessage } from "@prisma/client";
import { type LucideIcon } from "lucide-react";

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
      </div>
    </>
  );
};
