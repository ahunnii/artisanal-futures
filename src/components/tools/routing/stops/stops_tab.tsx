import { useStops } from "~/hooks/routing/use-stops";

import FulfillmentSheet from "~/components/tools/routing/stops/fulfillment_sheet";
import StopCard from "~/components/tools/routing/stops/stop_card";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions from "~/components/tools/routing/ui/tab_options";
import { ScrollArea } from "~/components/ui/scroll-area";

/**
 * Tab container component that allows users to add, edit, and delete stops.
 */
const StopsTab = () => {
  const { locations, activeLocation } = useStops((state) => state);

  return (
    <>
      <TabOptions type="stop" />
      {locations?.length === 0 && (
        <div className="flex w-full ">
          <FileUpload dataType="stop" />{" "}
        </div>
      )}
      <FulfillmentSheet stop={activeLocation} />

      <ScrollArea>
        <div className="space-y-2 p-2">
          {locations?.length > 0 &&
            locations.map((listing, idx) => (
              <StopCard key={idx} stop={listing} />
            ))}
        </div>
      </ScrollArea>
      {/* <div className="flex h-full w-full grow flex-col justify-start gap-4 overflow-y-auto p-4 py-3 ">
   
      </div>{" "} */}
    </>
  );
};

export default StopsTab;
