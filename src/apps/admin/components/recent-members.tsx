import type { User } from "@prisma/client";

import * as Card from "~/components/ui/card";
import PageLoader from "~/components/ui/page-loader";
import { ScrollArea } from "~/components/ui/scroll-area";
import { RecentMembersCard } from "./recent-member-card";

import { cn } from "~/utils/styles";

export function RecentMembers({
  members,
  isLoading,
  className,
}: {
  members: User[];
  isLoading: boolean;
} & React.HTMLAttributes<HTMLDivElement>) {
  if (isLoading) return <PageLoader />;

  return (
    <>
      <Card.Card className={cn("md:grid-cols-1 lg:col-span-3", className)}>
        <Card.CardHeader>
          <Card.CardTitle>Recent Members</Card.CardTitle>
          <Card.CardDescription>
            There were {members.length ?? 0} users added this month.
          </Card.CardDescription>
        </Card.CardHeader>
        <Card.CardContent className="flex max-h-[350px]">
          <ScrollArea className="w-full ">
            <div className="space-y-8">
              {members?.map((member, idx) => (
                <RecentMembersCard {...member} key={idx} />
              ))}
            </div>{" "}
          </ScrollArea>
        </Card.CardContent>
      </Card.Card>
    </>
  );
}
