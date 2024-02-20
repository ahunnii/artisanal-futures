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

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";

import { useDepot } from "../../hooks/depot/use-depot";
import { useCreateJob } from "../../hooks/jobs/CRUD/use-create-job";
import { useReadJob } from "../../hooks/jobs/CRUD/use-read-job";
import { formatNthDate, isDateToday } from "../../utils/current-date";
import { FileUploadModal } from "../shared/file-upload-modal.wip";
import { HomepageRouteCard } from "./homepage-route-card";

export const HomePageOverviewCard = ({}: { date?: Date }) => {
  const { depotId, routeDate, isFirstTime, sessionStatus } =
    useSolidarityState();

  const { currentDepot } = useDepot();

  const routePlan = useRoutePlans();
  const { createNewJobs } = useCreateJob();
  const { routeJobs } = useReadJob();

  const dateTitle = useMemo(
    () => (isDateToday(routeDate) ? "Today's" : formatNthDate(routeDate)),
    [routeDate]
  );

  const baseRouteUrl = `/tools/solidarity-pathways/${depotId}/route/`;

  const [parent] = useAutoAnimate();
  const [another] = useAutoAnimate();

  const manuallyCreateRoute = () =>
    routePlan.create({ depotId, date: routeDate });

  const clientJobImportOptions = clientJobUploadOptions({
    jobs: routeJobs,
    setJobs: createNewJobs,
  });

  const isUserAuthenticated = !isFirstTime && sessionStatus === "authenticated";
  const finalizedRoutes =
    routePlan.routesByDate?.filter((route) => route.optimizedRoute.length > 0)
      .length ?? null;

  // route.optimizedRoute.length > 0
  if (!isUserAuthenticated) return null;

  return (
    <Card className="w-full max-w-md lg:max-w-xl">
      <CardHeader>
        <CardTitle>{dateTitle} Overview</CardTitle>
        <CardDescription>
          {format(routeDate, "MMMM dd yyyy")} • Depot:{" "}
          {currentDepot?.name ?? depotId} •{" "}
          {finalizedRoutes
            ? `Finalized Routes: ${finalizedRoutes}`
            : `No finalized routes yet`}
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
        <div className="mt-10 flex  w-full  flex-col items-center gap-4 ">
          <p className="text-base">
            Need help with your spreadsheet formatting? Check out our guide on
            it here, or click here for a sample file.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
