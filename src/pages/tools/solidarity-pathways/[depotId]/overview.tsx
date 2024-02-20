import type { GetServerSidePropsContext } from "next";

import { UserPlus } from "lucide-react";

import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Button } from "~/components/ui/button";

import { HomePageOnboardingCard } from "~/apps/solidarity-routing/components/overview/homepage-onboarding-card.wip";
import { HomePageOverviewCard } from "~/apps/solidarity-routing/components/overview/homepage-overview-card.wip";
import { RouteCalendar } from "~/apps/solidarity-routing/components/overview/route-calendar.wip";

import { DriverVehicleSheet } from "~/apps/solidarity-routing/components/sheet-driver";

import RouteLayout from "~/apps/solidarity-routing/components/layout/route-layout";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import Link from "next/link";
import { ImportDriversButton } from "~/apps/solidarity-routing/components/overview/import-drivers-button";

import { CreateRouteButton } from "~/apps/solidarity-routing/components/overview/create-route-button";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";

import { PathwaySettingsButton } from "~/apps/solidarity-routing/components/overview/pathways-settings-button";
import { authenticateRoutingServerSide } from "~/apps/solidarity-routing/utils/authenticate-user";
import { useMediaQuery } from "~/hooks/use-media-query";

const PathwaysDepotOverviewPage = () => {
  const { sessionStatus } = useSolidarityState();

  const { onSheetOpenChange } = useDriverVehicleBundles();

  const isDesktop = useMediaQuery("(min-width: 1024px)");

  const addSingleDriver = () => onSheetOpenChange(true);

  if (sessionStatus === "loading") return <AbsolutePageLoader />;

  return (
    <>
      <DriverVehicleSheet standalone={true} />

      <RouteLayout>
        <section className="flex flex-col-reverse  border-2 max-lg:justify-center max-md:h-full md:flex-1 lg:flex-row">
          <section className="flex w-full max-w-sm flex-col gap-4 max-lg:hidden">
            <div className="flex h-full flex-col items-center space-y-4 bg-white px-4 pt-4">
              <CreateRouteButton />
              <RouteCalendar />
            </div>
            <div className=" flex flex-col items-start bg-white p-4 text-left">
              <Button
                className="mx-0 flex gap-2 px-0 "
                variant={"link"}
                onClick={addSingleDriver}
              >
                <UserPlus />
                Add Drivers
              </Button>
              <ImportDriversButton />

              <PathwaySettingsButton />
            </div>
          </section>
          <div className="relative flex w-full flex-col items-center justify-center space-y-10">
            {!isDesktop && <RouteCalendar />}

            <HomePageOnboardingCard />
            <HomePageOverviewCard />

            <h2>
              For questions and concerns, please contact us at{" "}
              <Link href="mailto:help@artisanalfutures.org">
                <Button
                  variant={"link"}
                  className="mx-0 px-0 text-muted-foreground"
                >
                  help@artisanalfutures.org
                </Button>
              </Link>
            </h2>
          </div>
        </section>
      </RouteLayout>
    </>
  );
};
const validateDate = (ctx: GetServerSidePropsContext) => {
  const { depotId, date, welcome } = ctx.query;

  if (!date)
    return {
      redirect: {
        destination: `/tools/solidarity-pathways/${
          depotId as string
        }/overview?date=${new Date().toDateString().replace(/\s/g, "+")}${
          welcome ? `&welcome=${welcome as string}` : ""
        }`,
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateRoutingServerSide(ctx, false, validateDate);

export default PathwaysDepotOverviewPage;
