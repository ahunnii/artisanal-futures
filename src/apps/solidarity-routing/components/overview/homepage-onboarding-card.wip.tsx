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

import { useMemo, type FC } from "react";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";

import { formatNthDate, isDateToday } from "../../utils/current-date";
import { HomepageDriverImportCard } from "./homepage-driver-import-card";
import { HomepageJobImportCard } from "./homepage-job-import-card";

type Props = {
  date: Date;
  status: "authenticated" | "loading" | "unauthenticated";
};

export const HomePageOnboardingCard: FC<Props> = ({ date, status }) => {
  const { depotId } = useSolidarityState();

  const routePlan = useRoutePlans();

  const manuallyCreateRoute = () => routePlan.create({ depotId, date });

  const dateTitle = useMemo(
    () => (isDateToday(date) ? "Today's" : formatNthDate(date)),
    [date]
  );
  return (
    <>
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle>{dateTitle} Overview</CardTitle>

          {status === "authenticated" && (
            <>
              <CardDescription>
                {format(date, "MMMM dd yyyy")} * Depot {depotId}
              </CardDescription>
            </>
          )}
          {status === "unauthenticated" && (
            <>
              <CardDescription>
                {format(date, "MMMM dd yyyy")} * Sandbox Mode
              </CardDescription>
            </>
          )}
        </CardHeader>

        <CardContent>
          {status === "unauthenticated" && (
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
