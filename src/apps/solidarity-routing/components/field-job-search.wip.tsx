"use client";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import {
  Calculator,
  Calendar,
  CreditCard,
  MapPin,
  Settings,
  Smile,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";

import { RouteStatus } from "@prisma/client";
import { useSearchParams } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "~/components/ui/command";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../hooks/jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "../hooks/optimized-data/use-optimized-route-plan";
import { updateRouteSearchParams } from "../utils/route-search-params";

export function FieldJobSearch({ isIcon }: { isIcon: boolean }) {
  const [open, setOpen] = useState(false);
  const params = useSearchParams();

  const optimizedRoutePlan = useOptimizedRoutePlan();
  const jobBundles = useClientJobBundles();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // const stopsByAddress = api.routePlan.getOptimizedStopsByAddress.useQuery(
  //   {
  //     optimizedRouteId: optimizedRoutePlan.data?.id ?? "",
  //     address: currentJob?.address.formatted ?? "",
  //   },
  //   {
  //     enabled:
  //       currentJob?.address.formatted !== undefined &&
  //       optimizedRoutePlan.data?.id !== undefined,
  //   }
  // );

  return (
    <>
      {/* <p className="text-sm text-muted-foreground">
        Press{" "}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </p> */}

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
            {/* {[...optimizedRoutePlan.destinations.keys()].map((key) => (
              <CommandItem key={key} className="flex  items-center ">
                <div
                  className="flex cursor-pointer items-center "
                  onClick={() => {
                    console.log(key);

                    const jobs = optimizedRoutePlan.destinations.get(key);
                    const nextJob = jobs?.find(
                      (job) =>
                        job.optimized?.status !== RouteStatus.COMPLETED &&
                        job.optimized?.status !== RouteStatus.FAILED
                    );

                    jobBundles.view(
                      nextJob?.bundle.job.id ?? jobs?.[0]?.bundle.job.id ?? null
                    );

                    // updateRouteSearchParams(
                    //   "address",
                    //   encodeURIComponent(key),
                    //   params
                    // );
                    setOpen(false);
                  }}
                >
                  <MapPin className="mr-2 h-4 w-4" />
                  <div className="flex flex-col">
                    {key} --
                    {optimizedRoutePlan?.destinations?.get(key)?.length ?? 0}
                  </div>
                </div>
              </CommandItem>
            ))} */}
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

          <CommandGroup heading="Suggestions">
            <CommandItem>
              <Calendar className="mr-2 h-4 w-4" />
              <span>Calendar</span>
            </CommandItem>
            <CommandItem>
              <Smile className="mr-2 h-4 w-4" />
              <span>Search Emoji</span>
            </CommandItem>
            <CommandItem>
              <Calculator className="mr-2 h-4 w-4" />
              <span>Calculator</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
              <CommandShortcut>⌘P</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Billing</span>
              <CommandShortcut>⌘B</CommandShortcut>
            </CommandItem>
            <CommandItem>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
              <CommandShortcut>⌘S</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
