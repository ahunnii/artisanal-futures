"use client";

import {
  Calculator,
  Calendar,
  CreditCard,
  MapPin,
  Settings,
  Smile,
  User,
} from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
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
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";

export function StopFilterBtn() {
  const [open, setOpen] = React.useState(false);
  const jobs = useClientJobBundles();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "j" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="mt-2 flex justify-between"
        variant={"outline"}
      >
        <span className="flex items-center text-xs font-normal text-muted-foreground">
          <MagnifyingGlassIcon className="mr-2 h-4 w-4" />
          Search stops
        </span>
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>J
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <div>
          <CommandInput
            placeholder="Type a command or search..."
            className="border-0 ring-0 focus:ring-0"
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Stops">
              {jobs.data?.map((stop) => (
                <CommandItem key={stop.job.id}>
                  <div
                    className="flex cursor-pointer items-center "
                    onClick={() => {
                      jobs.edit(stop.job.id);
                      setOpen(false);
                    }}
                  >
                    <MapPin className="mr-2 h-4 w-4" />
                    <div className="flex flex-col">
                      {stop.client?.name && <span>{stop.client?.name}</span>}

                      <span>{stop.job.address.formatted}</span>
                    </div>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>

            {jobs.clients && jobs.clients.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup heading="Clients">
                  {jobs.clients?.map((client) => (
                    <CommandItem key={client.id}>
                      <User className="mr-2 h-4 w-4" />
                      <div className="flex flex-col">
                        <span>{client.name}</span>
                        <span>{client.address?.formatted}</span>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </>
            )}
          </CommandList>
        </div>
      </CommandDialog>
    </>
  );
}
