"use client";

import _debounce from "lodash/debounce";
import { Check, Info, Loader2, MapPin, User } from "lucide-react";
import * as React from "react";
import { Button } from "~/components/ui/button";

import { Prisma } from "@prisma/client";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { CommandLoading } from "cmdk";
import { Badge } from "~/components/ui/badge";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "~/components/ui/command";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";
import { useCreateJob } from "../../hooks/jobs/CRUD/use-create-job";
import { useDeleteJob } from "../../hooks/jobs/CRUD/use-delete-job";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { useSolidarityState } from "../../hooks/optimized-data/use-solidarity-state";
import { CommandAdvancedDialog } from "./command-advanced-wrapper";

import SearchSelectOptions from "./search-select-options";

type SearchJob = Prisma.JobGetPayload<{
  include: {
    address: true;
    client: {
      include: {
        address: true;
      };
    };
  };
}>;

export function CommandSearchJobs() {
  const [open, setOpen] = React.useState(false);
  const jobs = useClientJobBundles();
  const { duplicateJobIdsToRoute } = useCreateJob();
  const { deleteJobsFromRoute } = useDeleteJob();
  const [value, setValue] = React.useState("");
  const apiContext = api.useContext();
  const [selectedJobs, setSelectedJobs] = React.useState<SearchJob[]>([]);
  const { routeId, depotId } = useSolidarityState();

  const listRef = React.useRef(null);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const getAllJobs = api.jobs.searchForJobs.useQuery(
    { depotId: depotId, queryString: value },
    { enabled: false }
  );

  const handleDebounceFn = () => {
    void getAllJobs.refetch();
  };

  const debounceFn = React.useCallback(_debounce(handleDebounceFn, 1000), []);

  const handleChange = (data: string) => {
    setValue(data);

    debounceFn();
  };

  // Allows you to search via keyboard shortcut
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

  // Fixes a weird pointer event overlap bug
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);

  const handleOnCommandDialogOpen = (state: boolean) => {
    if (!state) {
      void apiContext.jobs.invalidate();
      setValue("");
      setSelectedJobs([]);
    }
    setOpen(state);
  };

  const handleOnDuplicateJobs = () => {
    duplicateJobIdsToRoute({
      jobs: selectedJobs.map((job) => job.id),
    });

    void apiContext.jobs.invalidate();
    setValue("");
    setSelectedJobs([]);
  };
  const handleOnDeleteJobs = () => {
    deleteJobsFromRoute({
      jobs: selectedJobs.map((job) => job.id),
    });
    void apiContext.jobs.invalidate();
    setValue("");
    setSelectedJobs([]);
  };

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

      <CommandAdvancedDialog
        open={open}
        onOpenChange={handleOnCommandDialogOpen}
        shouldFilter={false}
      >
        <CommandInput
          placeholder="Search Jobs..."
          className="border-0 ring-0 focus:ring-0"
          ref={inputRef}
          value={value}
          onValueChange={handleChange}
        />
        <CommandList className="mb-12">
          <CommandEmpty>No results found.</CommandEmpty>

          <CommandSeparator />

          {!getAllJobs.isLoading && getAllJobs.data?.length !== 0 && (
            <CommandGroup heading="Jobs">
              {getAllJobs.data?.map((job) => (
                // <Link
                //   prefetch={false}
                //   href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/jobs/${job.id}`}
                //   key={job.id}
                // >
                <CommandItem
                  key={job.id}
                  className=" relative flex w-full justify-between gap-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      console.log("job.id", job.id);
                    }
                  }}
                >
                  <div className="group flex items-center gap-2 ">
                    <div
                      className={cn(
                        "aspect-square h-5 rounded-md border border-zinc-200 group-hover:border-zinc-400",
                        selectedJobs.filter((item) => item.id === job.id)
                          .length > 0
                          ? "bg-zinc-900"
                          : "bg-transparent"
                      )}
                      onClick={() => {
                        setSelectedJobs(
                          selectedJobs.filter((item) => item.id === job.id)
                            .length > 0
                            ? selectedJobs.filter((item) => item.id !== job.id)
                            : [...selectedJobs, job]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          " h-5 w-5 text-white",
                          selectedJobs.filter((item) => item.id === job.id)
                            .length > 0
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <span className="flex flex-col">
                      <span>{job.address?.formatted}</span>
                      <span>{job.client?.name ?? ""}</span>
                      <span className="text-xs">
                        {job.createdAt.toDateString()}{" "}
                        {routeId !== job.routeId && " -- Unable to delete"}
                      </span>
                    </span>
                  </div>{" "}
                  <Button
                    size={"sm"}
                    className="absolute right-8 z-50 max-h-8"
                    variant={"outline"}
                    type="button"
                    onClick={() => {
                      jobs.edit(job.id);
                      setOpen(false);
                    }}
                  >
                    Details...
                  </Button>
                  <span className="sr-only">{job.id}</span>
                  <span className="sr-only">{job.type}</span>
                  <span className="sr-only">{job.notes}</span>
                  <span className="sr-only">{job.order}</span>
                  <span className="sr-only">{job?.client?.name}</span>
                  <span className="sr-only">{job?.client?.email}</span>
                  <span className="sr-only">{job?.client?.phone}</span>
                  <span className="sr-only">
                    {job?.client?.address?.formatted}
                  </span>{" "}
                </CommandItem>
                // </Link>
              ))}

              {getAllJobs.data?.length === 0 && (
                <CommandItem>No jobs found</CommandItem>
              )}
            </CommandGroup>
          )}
          {selectedJobs?.length > 0 && (
            <CommandGroup heading="Selected">
              {selectedJobs?.map((job) => (
                // <Link
                //   prefetch={false}
                //   href={`/admin/${env.NEXT_PUBLIC_STORE_ID}/jobs/${job.id}`}
                //   key={job.id}
                // >
                <CommandItem
                  key={job.id}
                  className=" relative flex w-full justify-between gap-4"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      console.log("job.id", job.id);
                    }
                  }}
                >
                  <div className="group flex items-center gap-2 ">
                    <div
                      className={cn(
                        "aspect-square h-5 rounded-md border border-zinc-200 group-hover:border-zinc-400",
                        selectedJobs.filter((item) => item.id === job.id)
                          .length > 0
                          ? "bg-zinc-900"
                          : "bg-transparent"
                      )}
                      onClick={() => {
                        setSelectedJobs(
                          selectedJobs.filter((item) => item.id === job.id)
                            .length > 0
                            ? selectedJobs.filter((item) => item.id !== job.id)
                            : [...selectedJobs, job]
                        );
                      }}
                    >
                      <Check
                        className={cn(
                          " h-5 w-5 text-white",
                          selectedJobs.filter((item) => item.id === job.id)
                            .length > 0
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </div>
                    <span className="flex flex-col">
                      <span>{job.address?.formatted}</span>
                      <span>{job.client?.name ?? ""}</span>
                      <span className="text-xs">
                        {job.createdAt.toDateString()}{" "}
                        {routeId !== job.routeId && " -- Unable to delete"}
                      </span>
                    </span>
                  </div>{" "}
                  <Button
                    size={"sm"}
                    variant={"outline"}
                    className="absolute right-8 z-50 max-h-8"
                    type="button"
                    onClick={() => {
                      jobs.edit(job.id);
                      setOpen(false);
                    }}
                  >
                    Details...
                  </Button>
                  <span className="sr-only">{job.id}</span>
                  <span className="sr-only">{job.type}</span>
                  <span className="sr-only">{job.notes}</span>
                  <span className="sr-only">{job.order}</span>
                  <span className="sr-only">{job?.client?.name}</span>
                  <span className="sr-only">{job?.client?.email}</span>
                  <span className="sr-only">{job?.client?.phone}</span>
                  <span className="sr-only">
                    {job?.client?.address?.formatted}
                  </span>{" "}
                </CommandItem>
                // </Link>
              ))}

              {getAllJobs.data?.length === 0 && (
                <CommandItem>No jobs found</CommandItem>
              )}
            </CommandGroup>
          )}
          {getAllJobs.isLoading && value !== "" && (
            <CommandLoading>
              <CommandItem>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Fetching jobs
              </CommandItem>
            </CommandLoading>
          )}
          {/* 
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
            )} */}
        </CommandList>
        <div
          className={cn(
            "absolute bottom-0  flex h-12 w-full items-center justify-between border-t border-t-zinc-200 px-2 py-4",
            selectedJobs?.length > 0 && "justify-end"
          )}
        >
          {selectedJobs?.length === 0 && (
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <Info className="size-4" /> Select items to see options
            </p>
          )}

          {/* <Separator orientation="vertical" className="ml-4 mr-2" /> */}

          {selectedJobs?.length !== 0 && (
            <SearchSelectOptions
              listRef={listRef}
              inputRef={inputRef}
              handleOnDuplicateJobs={handleOnDuplicateJobs}
              handleOnDeleteJobs={handleOnDeleteJobs}
            />
          )}
        </div>
      </CommandAdvancedDialog>
    </>
  );
}
