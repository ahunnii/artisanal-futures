import { useEffect, useMemo, useState } from "react";

import { FilePlus, Settings, UserPlus } from "lucide-react";

import { useDriversStore } from "~/apps/solidarity-routing/hooks/drivers/use-drivers-store";
import { useStopsStore } from "~/apps/solidarity-routing/hooks/jobs/use-stops-store";

import RouteLayout from "~/apps/solidarity-routing/route-layout";

import type { GetServerSidePropsContext } from "next";

import { useSearchParams } from "next/navigation";

import { useRouter } from "next/router";
import { HomePageOnboardingCard } from "~/apps/solidarity-routing/components/homepage-onboarding-card.wip";
import { HomePageOverviewCard } from "~/apps/solidarity-routing/components/homepage-overview-card.wip";
import { RouteCalendar } from "~/apps/solidarity-routing/components/route-calendar.wip";
import { RouteUploadModal } from "~/apps/solidarity-routing/components/route-upload-modal.wip";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { Button } from "~/components/ui/button";

import { useSession } from "next-auth/react";

import { DriverAddSheet } from "~/apps/solidarity-routing/components/drivers/driver-add-sheet";
import { FileUploadModal } from "~/apps/solidarity-routing/components/file-upload-modal.wip";
import { driverVehicleUploadOptions } from "~/apps/solidarity-routing/data/drivers/driver-data";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { AbsolutePageLoader } from "~/components/absolute-page-loader";
import { Tabs, TabsContent } from "~/components/ui/tabs";

const PathwaysDepotOverviewPage = () => {
  const { status } = useSession();
  const [tabValue, setTabValue] = useState<string>("plan");

  const drivers = useDriverVehicleBundles();

  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    void useStopsStore.persist.rehydrate();
    void useDriversStore.persist.rehydrate();
  }, []);

  const fileUploadOptions = useMemo(
    () =>
      driverVehicleUploadOptions({
        drivers: drivers.depot,
        setDrivers: drivers.createMany,
        status,
      }),
    [status, drivers]
  );

  const isFirstTime = searchParams.get("welcome");

  const [date, setDate] = useState<Date | undefined>(new Date());

  const setSearchParamDate = (date: Date | undefined) => {
    if (!date) return;
    setDate(date);
    changeDate(date.toDateString());
  };

  const changeDate = (date: string) => {
    void router.push({
      pathname: router.pathname,
      query: { ...router.query, date: date },
    });
  };

  return (
    <>
      <DriverAddSheet standalone={true} />
      <RouteLayout>
        <section className="flex flex-1  flex-col-reverse border-2 max-md:h-full lg:flex-row">
          <Tabs
            defaultValue="plan"
            value={tabValue}
            onValueChange={setTabValue}
            className="flex w-full flex-col gap-4 max-lg:hidden max-lg:h-4/6 lg:w-5/12 xl:w-3/12"
          >
            <TabsContent value="plan" asChild>
              <>
                <div className="flex h-full flex-col items-center space-y-4 bg-white px-4 pt-4">
                  <RouteUploadModal variant="outline" />
                  <RouteCalendar date={date} setDate={setSearchParamDate} />
                </div>
                <div className=" flex flex-col items-start bg-white p-4 text-left">
                  <Button
                    className="mx-0 flex gap-2 px-0 "
                    variant={"link"}
                    onClick={() => drivers.onSheetOpenChange(true)}
                  >
                    <UserPlus />
                    Add Drivers
                  </Button>
                  <FileUploadModal<DriverVehicleBundle> {...fileUploadOptions}>
                    <Button
                      className="mx-0 flex gap-2 px-0 "
                      variant={"link"}
                      // onClick={depotDrivers.openDriverSheet}
                    >
                      <FilePlus />
                      Import Drivers
                    </Button>{" "}
                  </FileUploadModal>

                  <Button className="mx-0 flex gap-2 px-0 " variant={"link"}>
                    <Settings />
                    Settings
                  </Button>
                </div>
              </>
            </TabsContent>
          </Tabs>

          <div className="relative flex flex-col items-center justify-center space-y-10 max-md:aspect-square lg:w-7/12 xl:w-9/12">
            {/* <div className="relative h-full w-full"> */}
            {status === "loading" && <AbsolutePageLoader />}

            {status !== "loading" && (
              <>
                {" "}
                {/* <div className="text-center">
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
                Welcome to Solidarity Routing
              </h1>
              <p className="text-lg text-muted-foreground">
                {status === "authenticated"
                  ? "You're all set up! Let's get started."
                  : "Sign in to get started."}
              </p>
            </div> */}
                {/* Option 1: User is not authenticated, can still upload files, but warns that no work will be saved */}
                {/* Option 2: User is authenticated, first time,  let's them know they can also upload the drivers and clients as well as routes*/}
                {(isFirstTime ?? status === "unauthenticated") && (
                  <HomePageOnboardingCard
                    date={date ?? new Date()}
                    status={status}
                  />
                )}
                {/* Option 3: User is authenticated, xth time,  allows them to select existing route or create a new one*/}
                {!isFirstTime && status === "authenticated" && (
                  <HomePageOverviewCard date={date ?? new Date()} />
                )}
                <div>
                  <h2>
                    For questions and concerns, please contact us at
                    test@test.com
                  </h2>
                </div>
              </>
            )}
          </div>
        </section>
      </RouteLayout>
    </>
  );
};
export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const { depotId, date } = ctx.query;
  if (!date)
    return {
      redirect: {
        destination: `/tools/solidarity-pathways/${
          depotId as string
        }/overview?date=${new Date().toDateString().replace(/\s/g, "+")}`,
        permanent: false,
      },
    };

  return {
    props: {},
  };
};

export default PathwaysDepotOverviewPage;
