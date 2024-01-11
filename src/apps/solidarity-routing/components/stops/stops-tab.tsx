import { ScrollArea } from "~/components/ui/scroll-area";

import StopCard from "~/apps/solidarity-routing/components/stops/stop-card";
import TabOptions from "~/apps/solidarity-routing/components/ui/tab-options";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";
import OptionsBtn from "../ui/options-btn";

const StopsTab = () => {
  const { locations } = useStops((state) => state);

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Stops{" "}
            <span className="rounded-lg border border-slate-300 px-2">
              {locations?.length ?? 0}
            </span>
          </h2>
          {locations?.length !== 0 && <OptionsBtn type="stop" />}
        </div>
        {locations?.length === 0 && (
          <p>No stops have been added to this route yet.</p>
        )}

        {locations?.length === 0 && (
          <TabOptions
            type="stop"
            className="flex-col items-stretch  shadow-none"
          />
        )}
      </div>

      <ScrollArea className="flex-1 px-4">
        {locations?.length > 0 &&
          locations.map((listing, idx) => (
            <StopCard key={idx} stop={listing} />
          ))}
      </ScrollArea>
    </>
  );
};

export default StopsTab;
