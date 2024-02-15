import Link from "next/link";

import { useAutoAnimate } from "@formkit/auto-animate/react";
import { format } from "date-fns";
import { FilePlus, MapPin, Plus, Target, Truck } from "lucide-react";

import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { clientJobUploadOptions } from "~/apps/solidarity-routing/data/stop-data";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";
import { nthNumber } from "~/apps/solidarity-routing/utils/generic/nth-date";
import { FileUploadModal } from "./file-upload-modal.wip";

export type FileUploadHandler = (
  event: React.ChangeEvent<HTMLInputElement>
) => void;

export const HomePageOverviewCard = ({ date }: { date: Date }) => {
  const { depotId } = useSolidarityState();
  const routePlan = useRoutePlans();
  const jobBundles = useClientJobBundles();

  const todayDate =
    format(date, "MMMM dd yyyy") === format(new Date(), "MMMM dd yyyy");

  const dateTitle = todayDate
    ? "Today's"
    : `${format(date, "MMMM d")}${nthNumber(Number(format(date, "d")))}`;

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
                <li
                  key={route.id}
                  className=" my-2 rounded-md border  p-2 hover:bg-gray-100 hover:shadow-inner"
                >
                  <Link
                    href={`${baseRouteUrl}${route.id}?${
                      route.optimizedRoute.length > 0
                        ? "mode=calculate"
                        : "mode=plan"
                    }`}
                  >
                    <div>
                      <p className="text-sm font-semibold">
                        Route Plan #{route.id}
                      </p>

                      {route.optimizedRoute?.length > 0 && (
                        <p className="text-sm text-muted-foreground">
                          Routes were{" "}
                          {route.optimizedRoute?.find(
                            (r) => r.status === "IN_PROGRESS"
                          )
                            ? "initiated"
                            : route.optimizedRoute?.filter(
                                (r) => r.status === "COMPLETED"
                              ).length === route.optimizedRoute?.length &&
                              route.optimizedRoute?.length > 0
                            ? "finished"
                            : "not started"}
                        </p>
                      )}

                      {route.optimizedRoute?.length === 0 && (
                        <p className="text-sm text-muted-foreground">
                          Routes still being drafted
                        </p>
                      )}

                      <div className="flex w-full space-x-2">
                        <Badge className="gap-1" variant={"outline"}>
                          <Truck className="h-4 w-4" />
                          Vehicles {route?.vehicles.length}
                        </Badge>
                        <Badge className="gap-1" variant={"outline"}>
                          <MapPin className="h-4 w-4" /> Jobs{" "}
                          {route?.jobs.length}
                        </Badge>

                        <Badge className="gap-1" variant={"default"}>
                          <Target className="h-4 w-4" />{" "}
                          {route.optimizedRoute?.length > 0
                            ? `${route.optimizedRoute?.length} path(s) optimized`
                            : "Draft"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                </li>
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
