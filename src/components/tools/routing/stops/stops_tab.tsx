import { useStops } from "~/hooks/routing/use-stops";

import FulfillmentSheet from "~/components/tools/routing/stops/fulfillment-sheet";
import StopCard from "~/components/tools/routing/stops/stop-card";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions, {
  ImportOptionsBtn,
} from "~/components/tools/routing/ui/tab_options";
import { ScrollArea } from "~/components/ui/scroll-area";

import StopMinimalCard from "./stop-minimal-card";

/**
 * Tab container component that allows users to add, edit, and delete stops.
 */
const StopsTab = () => {
  const { locations, activeLocation } = useStops((state) => state);

  return (
    <>
      <TabOptions type="stop" />
      {locations?.length === 0 && (
        <div className="flex w-full flex-grow">
          <FileUpload dataType="stop" />{" "}
        </div>
      )}
      <FulfillmentSheet stop={activeLocation} />
      <ScrollArea className=" flex grow">
        {locations?.length > 0 &&
          locations.map((listing, idx) => (
            <StopCard key={idx} stop={listing} />
          ))}
      </ScrollArea>
    </>
  );
};

export const StopsDynamicTab = () => {
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
          {locations?.length !== 0 && <ImportOptionsBtn type="stop" />}
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
            <>
              <StopMinimalCard key={idx} stop={listing} />
            </>
          ))}
      </ScrollArea>
    </>
  );
};

export default StopsTab;
