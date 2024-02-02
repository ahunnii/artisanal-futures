import { ScrollArea } from "~/components/ui/scroll-area";

import StopCard from "~/apps/solidarity-routing/components/stops/stop-card";
import TabOptions from "~/apps/solidarity-routing/components/ui/tab-options";

import { Lightbulb } from "lucide-react";
import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";
import { Button } from "~/components/ui/button";
import OptionsBtn from "../ui/options-btn";

const StopsTab = () => {
  const { locations } = useStops((state) => state);

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex scroll-m-20 gap-3 text-xl font-semibold tracking-tight">
            Stops{" "}
            <span className="rounded-lg border border-slate-300 px-2 text-base">
              {locations?.length ?? 0}
            </span>
          </h2>
          {locations?.length !== 0 && <OptionsBtn type="stop" />}
        </div>

        {locations?.length === 0 && (
          <>
            <p className="text-sm text-muted-foreground">
              No stops have been added to this route yet.
            </p>{" "}
            <div className="flex flex-col space-y-3 py-4">
              <Button className="" size={"lg"}>
                Import stops from spreadsheet{" "}
              </Button>
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
        {locations?.length > 0 &&
          locations.map((listing, idx) => (
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
