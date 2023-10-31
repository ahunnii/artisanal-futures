import { useStops } from "~/hooks/routing/use-stops";

import FulfillmentSheet from "~/components/tools/routing/stops/fulfillment_sheet";
import StopCard from "~/components/tools/routing/stops/stop_card";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions from "~/components/tools/routing/ui/tab_options";

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
      <div className="flex h-full w-full grow flex-col justify-start gap-4 overflow-y-auto p-4 py-3 ">
        {locations?.length > 0 &&
          locations.map((listing, idx) => (
            <StopCard key={idx} stop={listing} />
          ))}
      </div>{" "}
    </>
  );
};

export default StopsTab;
