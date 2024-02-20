import { format } from "date-fns";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

import { useMemo } from "react";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";

import { useDepot } from "../../hooks/depot/use-depot";
import { formatNthDate, isDateToday } from "../../utils/current-date";
import { HomepageDriverImportCard } from "./homepage-driver-import-card";
import { HomepageJobImportCard } from "./homepage-job-import-card";

export const HomePageOnboardingCard = () => {
  const { depotId, isFirstTime, sessionStatus, routeDate } =
    useSolidarityState();

  const { currentDepot } = useDepot();

  const { create: createRoute } = useRoutePlans();

  const manuallyCreateRoute = () => createRoute({ depotId, date: routeDate });

  const dateTitle = useMemo(
    () => (isDateToday(routeDate) ? "Today's" : formatNthDate(routeDate)),
    [routeDate]
  );

  const isUserOnboarding = isFirstTime ?? sessionStatus === "unauthenticated";

  if (!isUserOnboarding) return null;
  return (
    <>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{dateTitle} Overview</CardTitle>

          {sessionStatus === "authenticated" && (
            <>
              <CardDescription>
                {format(routeDate, "MMMM dd yyyy")} * Depot{" "}
                {currentDepot?.name ?? depotId}
              </CardDescription>
            </>
          )}
          {sessionStatus === "unauthenticated" && (
            <>
              <CardDescription>
                {format(routeDate, "MMMM dd yyyy")} * Sandbox Mode
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {sessionStatus === "unauthenticated" && (
            <p className="mb-6 leading-7 [&:not(:first-child)]:mt-6">
              It looks like you are not logged in. You can still continue to use
              Solidarity Pathways, but all routes and data will be discarded
              after you close the page.
            </p>
          )}{" "}
          <div className="grid  w-full grid-cols-1 items-center gap-4 md:grid-cols-2">
            <HomepageDriverImportCard />
            <HomepageJobImportCard />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-4">
          <Button variant="secondary" onClick={manuallyCreateRoute}>
            Nah, I&apos;ll just do it later{" "}
          </Button>
        </CardFooter>
      </Card>
    </>
  );
};
