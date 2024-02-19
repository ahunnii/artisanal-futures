import type { GetServerSidePropsContext } from "next";
import { useEffect, useMemo, useState } from "react";

import { FilePlus, Settings, UserPlus } from "lucide-react";
import { useSession } from "next-auth/react";

import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent } from "~/components/ui/tabs";

import { HomePageOnboardingCard } from "~/apps/solidarity-routing/components/overview/homepage-onboarding-card.wip";
import { HomePageOverviewCard } from "~/apps/solidarity-routing/components/overview/homepage-overview-card.wip";
import { RouteCalendar } from "~/apps/solidarity-routing/components/overview/route-calendar.wip";
import { FileUploadModal } from "~/apps/solidarity-routing/components/shared/file-upload-modal.wip";
import { DriverVehicleSheet } from "~/apps/solidarity-routing/components/sheet-driver";

import RouteLayout from "~/apps/solidarity-routing/components/layout/route-layout";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useStopsStore } from "~/apps/solidarity-routing/hooks/jobs/use-stops-store";
import { useDriversStore } from "~/apps/solidarity-routing/stores/use-drivers-store";

import { MessageSheet } from "~/apps/solidarity-routing/components/messaging/message-sheet";
import { PathwaysSettingsMenu } from "~/apps/solidarity-routing/components/settings/pathways-settings-menu.wip";
import { driverVehicleUploadOptions } from "~/apps/solidarity-routing/data/driver-data";
import { clientJobUploadOptions } from "~/apps/solidarity-routing/data/stop-data";

import Link from "next/link";
import { useCreateDriver } from "~/apps/solidarity-routing/hooks/drivers/CRUD/use-create-driver";
import { useReadDriver } from "~/apps/solidarity-routing/hooks/drivers/CRUD/use-read-driver";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import type {
  ClientJobBundle,
  DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { authenticateRoutingServerSide } from "~/apps/solidarity-routing/utils/authenticate-user";
import { useMediaQuery } from "~/hooks/use-media-query";
import { useUrlParams } from "~/hooks/use-url-params";

const PathwaysDepotOverviewPage = () => {
  const { status } = useSession();

  const { routeDate, isFirstTime } = useSolidarityState();
  const [date, setDate] = useState<Date | undefined>(routeDate ?? new Date());

  const [tabValue, setTabValue] = useState<string>("plan");

  const { onSheetOpenChange } = useDriverVehicleBundles();
  const { depotDrivers } = useReadDriver();
  const { createNewDrivers } = useCreateDriver();
  const jobBundles = useClientJobBundles();
  const { updateUrlParams } = useUrlParams();

  useEffect(() => {
    void useStopsStore.persist.rehydrate();
    void useDriversStore.persist.rehydrate();
  }, []);

  const fileUploadOptions = driverVehicleUploadOptions({
    drivers: depotDrivers,
    setDrivers: createNewDrivers,
  });

  const clientJobImportOptions = clientJobUploadOptions({
    jobs: jobBundles.data,
    setJobs: jobBundles.createMany,
  });

  const updateSelectedDate = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    updateUrlParams({
      key: "date",
      value: date.toDateString(),
    });
  };

  const isUserOnboarding = isFirstTime ?? status === "unauthenticated";
  const isUserAuthenticated = !isFirstTime && status === "authenticated";
  const isDesktop = useMediaQuery("(min-width: 1024px)");
  const addSingleDriver = () => onSheetOpenChange(true);

  return (
    <>
      <DriverVehicleSheet standalone={true} />

      <RouteLayout>
        <section className="flex flex-col-reverse  border-2 max-lg:justify-center max-md:h-full md:flex-1 lg:flex-row">
          <Tabs
            defaultValue="plan"
            value={tabValue}
            onValueChange={setTabValue}
            className="flex w-full max-w-sm flex-col gap-4 max-lg:hidden"
          >
            <TabsContent value="plan" asChild>
              <>
                <div className="flex h-full flex-col items-center space-y-4 bg-white px-4 pt-4">
                  <FileUploadModal<ClientJobBundle> {...clientJobImportOptions}>
                    <Button
                      variant="outline"
                      className="flex w-full flex-1 items-center gap-2"
                    >
                      <FilePlus className="h-5 w-5" /> Create a route using a
                      spreadsheet
                    </Button>
                  </FileUploadModal>
                  <RouteCalendar date={date} setDate={updateSelectedDate} />
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
                  <FileUploadModal<DriverVehicleBundle> {...fileUploadOptions}>
                    <Button className="mx-0 flex gap-2 px-0 " variant={"link"}>
                      <FilePlus />
                      Import Drivers
                    </Button>{" "}
                  </FileUploadModal>

                  <PathwaysSettingsMenu>
                    <Button className="mx-0 flex gap-2 px-0 " variant={"link"}>
                      <Settings />
                      Settings
                    </Button>
                  </PathwaysSettingsMenu>
                </div>
              </>
            </TabsContent>
          </Tabs>

          <div className="relative flex w-full flex-col items-center justify-center space-y-10">
            {!isDesktop && (
              <RouteCalendar date={date} setDate={updateSelectedDate} />
            )}

            {status === "loading" && <AbsolutePageLoader />}

            {status !== "loading" && (
              <>
                {isUserOnboarding && (
                  <HomePageOnboardingCard
                    date={date ?? new Date()}
                    status={status}
                  />
                )}

                {isUserAuthenticated && (
                  <HomePageOverviewCard date={date ?? new Date()} />
                )}

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
              </>
            )}
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

  // return {
  //   props: {},
  // };
};

export const getServerSideProps = async (ctx: GetServerSidePropsContext) =>
  authenticateRoutingServerSide(ctx, false, validateDate);

export default PathwaysDepotOverviewPage;
