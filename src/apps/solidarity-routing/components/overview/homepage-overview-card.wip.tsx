import { useAutoAnimate } from "@formkit/auto-animate/react";
import { format } from "date-fns";
import { FilePlus, Plus } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { useMemo } from "react";
import { clientJobUploadOptions } from "~/apps/solidarity-routing/data/stop-data";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";

import { formatNthDate, isDateToday } from "../../utils/current-date";
import { FileUploadModal } from "../shared/file-upload-modal.wip";
import { HomepageRouteCard } from "./homepage-route-card";

export const HomePageOverviewCard = ({ date }: { date: Date }) => {
  const { depotId } = useSolidarityState();
  const routePlan = useRoutePlans();
  const jobBundles = useClientJobBundles();

  const dateTitle = useMemo(
    () => (isDateToday(date) ? "Today's" : formatNthDate(date)),
    [date]
  );

  const baseRouteUrl = `/tools/solidarity-pathways/${depotId}/route/`;

  const [parent] = useAutoAnimate();
  const [another] = useAutoAnimate();

  const manuallyCreateRoute = () => routePlan.create({ depotId, date });

  const clientJobImportOptions = clientJobUploadOptions({
    jobs: jobBundles.data,
    setJobs: jobBundles.createMany,
  });

  return (
    <Card className="w-full max-w-xl">
      <CardHeader>
        <CardTitle>{dateTitle} Overview</CardTitle>
        <CardDescription>
          {format(date, "MMMM dd yyyy")} * Depot {depotId} * No finalized routes
          yet
        </CardDescription>
      </CardHeader>
      <CardContent ref={parent}>
        <div className="flex w-full  flex-col  items-center gap-4 ">
          <FileUploadModal<ClientJobBundle> {...clientJobImportOptions}>
            <Button
              variant="default"
              className="flex w-full flex-1 items-center gap-2"
            >
              <FilePlus className="h-5 w-5" /> Create a route using a
              spreadsheet
            </Button>
          </FileUploadModal>

          <Button
            className="w-full  gap-2"
            variant={"outline"}
            onClick={manuallyCreateRoute}
          >
            <Plus /> Manually create a route
          </Button>
        </div>
        <h3 className="pt-4 text-lg font-semibold">Routes</h3>
        {routePlan.routesByDate?.length === 0 && (
          <p className="text-muted-foreground">No routes found for this date</p>
        )}

        {routePlan.routesByDate && (
          <ul className="mt-4 flex flex-col" ref={another}>
            {routePlan.routesByDate?.length > 0 &&
              routePlan.routesByDate?.map((route) => (
                <HomepageRouteCard
                  key={route.id}
                  baseRouteUrl={baseRouteUrl}
                  routeId={route.id}
                  optimizedRoutes={route.optimizedRoute}
                  jobLength={route.jobs.length}
                  vehicleLength={route.vehicles.length}
                />
              ))}
          </ul>
        )}
        <div className="mt-10 flex  w-full  flex-col items-center gap-4">
          <p>
            Need help with your spreadsheet formatting? Check out our guide on
            it here, or click here for a sample file.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
