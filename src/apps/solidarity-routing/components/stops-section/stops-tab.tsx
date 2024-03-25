import { ScrollArea } from "~/components/ui/scroll-area";

import StopCard from "~/apps/solidarity-routing/components/stops-section/stop-card";

import { Lightbulb } from "lucide-react";

import { useMemo } from "react";

import { Button } from "~/components/ui/button";
import { clientJobUploadOptions } from "../../data/stop-data";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import type { ClientJobBundle } from "../../types.wip";
import { FileUploadModal } from "../shared/file-upload-modal.wip";

import { CommandSearchJobs } from "./command-search-jobs";
import StopOptionBtn from "./stop-option-btn.wip";

const StopsTab = () => {
  const jobs = useClientJobBundles();

  const fileUploadOptions = useMemo(
    () =>
      clientJobUploadOptions({
        jobs: jobs.data,
        setJobs: jobs.createMany,
      }),
    [jobs]
  );

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex scroll-m-20 gap-3 text-xl font-semibold tracking-tight">
            Stops{" "}
            <span className="rounded-lg border border-slate-300 px-2 text-base">
              {jobs.data?.length ?? 0}
            </span>
          </h2>

          {jobs.data?.length !== 0 && <StopOptionBtn />}
        </div>
        <CommandSearchJobs />
        {jobs.data?.length === 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              No stops have been added to this route yet.
            </p>{" "}
            <div className="flex flex-col space-y-3 py-4">
              <FileUploadModal<ClientJobBundle> {...fileUploadOptions}>
                <Button className="w-full" size={"lg"}>
                  Import stops from spreadsheet{" "}
                </Button>
              </FileUploadModal>
              <Button
                variant={"outline"}
                size={"lg"}
                onClick={() => jobs.addPrevious()}
              >
                Add previous stops & clients
              </Button>

              <Button
                variant={"outline"}
                size={"lg"}
                onClick={() => jobs.createNew()}
              >
                Manually add new stop
              </Button>
            </div>
            <div className="flex items-center bg-muted text-xs">
              <Lightbulb className="h-6 w-6" />
              <p>
                Hint: You can right click the map and add stops and new drivers
              </p>
            </div>
          </>
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        {jobs.data?.length > 0 &&
          jobs.data.map((listing, idx) => (
            <StopCard
              key={idx}
              id={listing.job.id}
              name={listing?.client?.name ?? `Job # ${listing.job.id}`}
              address={listing.job.address.formatted}
            />
          ))}
      </ScrollArea>
    </>
  );
};

export default StopsTab;
