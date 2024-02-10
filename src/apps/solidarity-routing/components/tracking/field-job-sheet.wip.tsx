import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "~/components/ui/map-sheet";

import CurrentStopForm from "~/apps/solidarity-routing/components/tracking/current-stop-form";

import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "../../hooks/optimized-data/use-optimized-route-plan";
import type { OptimizedStop } from "../../types.wip";

// Details as part of the individual driver route view. On click, the driver can edit
// basic information about the stop, such as the status and delivery notes.
const FieldJobSheet = () => {
  const jobBundles = useClientJobBundles();
  const optimizedRoutePlan = useOptimizedRoutePlan();

  const currentStop = optimizedRoutePlan?.data?.stops.find(
    (stop) => stop?.jobId === jobBundles.active?.job.id
  );

  return (
    <Sheet
      open={jobBundles.isFieldJobSheetOpen}
      onOpenChange={jobBundles.onFieldJobSheetOpen}
    >
      <SheetContent side={"bottom"}>
        <SheetHeader>
          <SheetTitle>Address</SheetTitle>
        </SheetHeader>
        <div className=" relative flex-1 overflow-y-scroll  py-2">
          <CurrentStopForm
            callback={() => void 0}
            initialData={jobBundles.active}
            job={(currentStop as OptimizedStop) ?? null}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default FieldJobSheet;
