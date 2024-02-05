import { ScrollArea } from "~/components/ui/scroll-area";

import StopCard from "~/apps/solidarity-routing/components/stops/stop-card";
import TabOptions from "~/apps/solidarity-routing/components/ui/tab-options";

import { Lightbulb } from "lucide-react";
import { useSession } from "next-auth/react";
import { useMemo } from "react";
import { useStopsStore } from "~/apps/solidarity-routing/hooks/use-stops-store";
import { Button } from "~/components/ui/button";
import { clientJobUploadOptions } from "../../data/stops/stop-data";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { ClientJobBundle } from "../../types.wip";
import { FileUploadModal } from "../file-upload-modal.wip";
import OptionsBtn from "../ui/options-btn";

const StopsTab = () => {
  const { stops, setStops } = useClientJobBundles();
  const { status } = useSession();

  const fileUploadOptions = useMemo(
    () =>
      clientJobUploadOptions({
        jobs: stops,
        setJobs: setStops,
        status,
      }),
    [stops, status, setStops]
  );

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex scroll-m-20 gap-3 text-xl font-semibold tracking-tight">
            Stops{" "}
            <span className="rounded-lg border border-slate-300 px-2 text-base">
              {stops?.length ?? 0}
            </span>
          </h2>
          {stops?.length !== 0 && <OptionsBtn type="stop" />}
        </div>

        {stops?.length === 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              No stops have been added to this route yet.
            </p>{" "}
            <div className="flex flex-col space-y-3 py-4">
              <FileUploadModal<ClientJobBundle> {...fileUploadOptions}>
                <Button className="" size={"lg"}>
                  Import stops from spreadsheet{" "}
                </Button>
              </FileUploadModal>
              <Button variant={"outline"} size={"lg"}>
                Add previous stops & clients
              </Button>
              <Button variant={"outline"} size={"lg"}>
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
        {stops?.length > 0 &&
          stops.map((listing, idx) => (
            <StopCard
              key={idx}
              id={listing.job.id}
              name={listing.client.name ?? "New Stop"}
              address={listing.job.address.formatted}
            />
          ))}
      </ScrollArea>
    </>
  );
};

export default StopsTab;
