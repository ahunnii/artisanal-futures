import Head from "next/head";
import { useEffect, useState } from "react";

import { Settings, UserPlus } from "lucide-react";

import { DriverSheet } from "~/apps/solidarity-routing/components/drivers";
import { StopSheet } from "~/apps/solidarity-routing/components/stops";

import { useDrivers } from "~/apps/solidarity-routing/hooks/drivers/use-drivers";

import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";
import RouteLayout from "~/apps/solidarity-routing/route-layout";

import type { GetServerSidePropsContext } from "next";

import { useSearchParams } from "next/navigation";

import { useRouter } from "next/router";
import { HomePageOnboarding } from "~/apps/solidarity-routing/components/homepage-onboarding.wip";
import { HomePageOverview } from "~/apps/solidarity-routing/components/homepage-overview.wip";
import { RouteCalendar } from "~/apps/solidarity-routing/components/route-calendar.wip";
import { RouteUploadModal } from "~/apps/solidarity-routing/components/route-upload-modal.wip";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { Button } from "~/components/ui/button";

import { Tabs, TabsContent } from "~/components/ui/tabs";

const PathwaysDepotOverviewPage = () => {
  const [tabValue, setTabValue] = useState<string>("plan");
  const { drivers: depotDrivers, status } = useDriverVehicleBundles();

  const searchParams = useSearchParams();

  const router = useRouter();

  useEffect(() => {
    void useStops.persist.rehydrate();
    void useDrivers.persist.rehydrate();
  }, []);

  const isFirstTime = searchParams.get("welcome");

  const [isRouteModalOpen, setIsRouteModalOpen] = useState(false);
  const [date, setDate] = useState<Date | undefined>(new Date());

  const setSearchParamDate = (date: Date) => {
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
      <Head>
        <title>Solidarity Pathways Home | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />{" "}
        <meta
          name="viewport"
          content="width=device-width,height=device-height initial-scale=1"
        />
        <link rel="icon" href="/favicon.ico" />{" "}
      </Head>

      <StopSheet />
      <DriverSheet />

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
                  <RouteUploadModal
                    open={isRouteModalOpen}
                    setOpen={setIsRouteModalOpen}
                  />
                  <RouteCalendar date={date} setDate={setSearchParamDate} />
                </div>
                <div className=" flex flex-col items-start bg-white p-4 text-left">
                  <Button
                    className="mx-0 flex gap-2 px-0 "
                    variant={"link"}
                    onClick={depotDrivers.openDriverSheet}
                  >
                    <UserPlus />
                    Add Drivers
                  </Button>
                  <Button className="mx-0 flex gap-2 px-0 " variant={"link"}>
                    <Settings />
                    Settings
                  </Button>
                </div>
              </>
            </TabsContent>
          </Tabs>

          <div className="flex flex-col items-center justify-center space-y-10 max-md:aspect-square lg:w-7/12 xl:w-9/12">
            <div className="text-center">
              {" "}
              <h1 className="scroll-m-20 text-4xl font-bold tracking-tight">
                Welcome to Solidarity Routing
              </h1>
              <p className="text-lg text-muted-foreground">
                {status === "authenticated"
                  ? "You're all set up! Let's get started."
                  : "Sign in to get started."}
              </p>
            </div>

            {(isFirstTime ?? status === "unauthenticated") && (
              <HomePageOnboarding date={date ?? new Date()} />
            )}

            {!isFirstTime && <HomePageOverview date={date ?? new Date()} />}

            <div>
              <h2>
                For questions and concerns, please contact us at test@test.com
              </h2>
            </div>
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

// export const getServerSideProps = async (ctx: GetServerSidePropsContext) => {
//   const user = await authenticateUser(ctx);

//   if (!user)
//     return {
//       props: {},
//     };

//   const ownedDepot = await prisma.depot.findUnique({
//     where: {
//       ownerId: user.id,
//     },
//   });

//   const allowedDepots = await prisma.depot.findMany({
//     where: {
//       users: {
//         some: {
//           id: user.id,
//         },
//       },
//     },
//   });

//   if (!ownedDepot && allowedDepots.length === 0) {
//     // Create a new depot and redirect to it
//     const newDepot = await prisma.depot.create({
//       data: {
//         name: "New Depot",
//         ownerId: user.id,
//       },
//     });

//     return {
//       redirect: {
//         destination: `/tools/solidarity-pathways/${newDepot.id}?welcome=true`,
//         permanent: false,
//       },
//     };
//   } else {
//     //Redirect to owned or allowed
//     const depotId = ownedDepot?.id ?? allowedDepots[0]?.id ?? "";

//     return {
//       redirect: {
//         destination: `/tools/solidarity-pathways/${depotId}`,
//         permanent: false,
//       },
//     };
//   }
// };
export default PathwaysDepotOverviewPage;
