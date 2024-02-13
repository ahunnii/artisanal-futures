import { useState, type ComponentProps } from "react";

import { CaretSortIcon } from "@radix-ui/react-icons";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { ScrollArea } from "~/components/ui/scroll-area";

import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import type { ClientJobBundle } from "../../types.wip";

interface CardProps extends ComponentProps<typeof Card> {
  unassigned: ClientJobBundle[];
}
export const UnassignedSummary = ({
  unassigned,
  className,
  ...props
}: CardProps) => {
  const jobBundles = useClientJobBundles();

  return (
    <Card className={cn("w-full", className)} {...props}>
      <CardHeader>
        <CardTitle className="text-xs">Unassigned</CardTitle>
        <CardDescription>
          You have {unassigned.length} unassigned routes.
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4 ">
        <ScrollArea className="h-36 flex-1 ">
          <div className="flex flex-col space-y-4">
            {unassigned?.map((bundle) => {
              return (
                <div
                  key={bundle.job.id}
                  className="flex cursor-pointer  items-start p-2 odd:bg-slate-100 hover:bg-slate-200"
                  onClick={() => {
                    jobBundles.edit(`${bundle.job.id}`);
                  }}
                >
                  <div className="space-y-0.5 text-left">
                    <p className="text-sm font-medium capitalize leading-none">
                      {bundle?.client?.name ?? `Job #${bundle.job.id}`}
                    </p>
                    <p className="text-xs font-medium leading-none">
                      {bundle?.job.address.formatted}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
