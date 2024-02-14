import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { MapPin } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "~/components/ui/command";

import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "~/apps/solidarity-routing/hooks/optimized-data/use-optimized-route-plan";
import { cn } from "~/utils/styles";

export function FieldJobSearch({ isIcon }: { isIcon: boolean }) {
  const [open, setOpen] = useState(false);

  const optimizedRoutePlan = useOptimizedRoutePlan();
  const jobBundles = useClientJobBundles();

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className={cn(
          "flex flex-1 items-center justify-start gap-2 font-normal text-muted-foreground focus:ring-0",
          isIcon && "flex-none justify-center"
        )}
        variant={isIcon ? "ghost" : "outline"}
        size={isIcon ? "icon" : "sm"}
      >
        <MagnifyingGlassIcon className="h-4 w-4" />
        <>{isIcon ? null : "Search"}</>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          placeholder="Type a command or search..."
          className="border-0 ring-0 hover:ring-0 focus:ring-0"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Addresses">
            {optimizedRoutePlan.assigned.map((job) => (
              <CommandItem key={job.job.id} className="flex  items-center ">
                <div
                  className="flex cursor-pointer items-center "
                  onClick={() => {
                    jobBundles.view(job.job.id);
                    setOpen(false);
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    {job.client?.name
                      ? `${job.client?.name} - `
                      : `${job.job?.id} -`}
                    {job.job.address.formatted}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
