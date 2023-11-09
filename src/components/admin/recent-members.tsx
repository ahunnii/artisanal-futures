import type { User } from "@prisma/client";

import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { ScrollArea } from "~/components/ui/scroll-area";

export function RecentMembers({ members }: { members: User[] }) {
  return (
    <ScrollArea className="w-full ">
      <div className="space-y-8">
        {members?.map((member, idx) => (
          <RecentMembersCard {...member} key={idx} />
        ))}
      </div>{" "}
    </ScrollArea>
  );
}

const RecentMembersCard = ({ name, email, image, role }: Partial<User>) => (
  <div className="flex items-center">
    <Avatar className="h-9 w-9">
      <AvatarImage src={image ?? ""} alt="Avatar" />
      <AvatarFallback>{name?.substring(0, 2)}</AvatarFallback>
    </Avatar>
    <div className="ml-4 space-y-1">
      <p className="text-sm font-medium leading-none">{name}</p>
      <p className="text-sm text-muted-foreground">{email}</p>
    </div>
    <div className="ml-auto font-medium">{role}</div>
  </div>
);
