import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";

import { ArrowRight } from "lucide-react";

import {
  DriverSheet,
  DriversTab,
} from "~/apps/solidarity-routing/components/drivers";
import {
  StopSheet,
  StopsTab,
} from "~/apps/solidarity-routing/components/stops";

import CalculationsTab from "~/apps/solidarity-routing/components/solutions/calculations-tab";
import BottomSheet from "~/apps/solidarity-routing/components/ui/bottom-sheet";
import { useDrivers } from "~/apps/solidarity-routing/hooks/use-drivers";
import useRouteOptimization from "~/apps/solidarity-routing/hooks/use-route-optimization";
import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";
import RouteLayout from "~/apps/solidarity-routing/route-layout";

import type { GetServerSidePropsContext } from "next";

import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { prisma } from "~/server/db";
import { authenticateUser } from "~/utils/auth";

const LazyRoutingMap = dynamic(
  () => import("~/apps/solidarity-routing/components/map/routing-map"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);
/**
 * Page component that allows users to generate routes based on their input.
 */
const RoutingPage = () => {
  const [tabValue, setTabValue] = useState<string>("plan");

  const { locations } = useStops((state) => state);
  const { drivers } = useDrivers((state) => state);

  useEffect(() => {
    void useStops.persist.rehydrate();
    void useDrivers.persist.rehydrate();
  }, []);

  const { getRoutes } = useRouteOptimization();

  const calculateOptimalPaths = () => {
    setTabValue("calculate");
    void getRoutes();
  };

  const openTrackingPage = () =>
    window.open("/tools/routing/tracking", "_blank");

  const isRouteDataMissing = locations.length === 0 || drivers.length === 0;

  return (
    <>
      <Head>
        <title>Routing Optimization | Artisanal Futures</title>
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
            <TabsList className=" flex ">
              <TabsTrigger value="plan" className="w-full">
                Plan
              </TabsTrigger>
              <TabsTrigger
                value="calculate"
                className="w-full"
                disabled={isRouteDataMissing}
                onClick={calculateOptimalPaths}
              >
                Calculate
              </TabsTrigger>{" "}
              <Button
                className="w-full"
                variant={"ghost"}
                disabled={isRouteDataMissing}
                onClick={openTrackingPage}
              >
                Track
              </Button>
            </TabsList>
            <TabsContent value="plan" asChild>
              <>
                <DriversTab />
                <StopsTab />
                <div className=" flex h-16 items-center justify-end bg-white p-4">
                  <Button
                    onClick={calculateOptimalPaths}
                    className="gap-2"
                    disabled={isRouteDataMissing}
                  >
                    Calculate Routes <ArrowRight />
                  </Button>
                </div>
              </>
            </TabsContent>
            <TabsContent value="calculate" asChild>
              <>
                <CalculationsTab />
                <div className=" flex h-16 items-center justify-end bg-white p-4">
                  <Button
                    onClick={calculateOptimalPaths}
                    className="gap-2"
                    disabled={locations.length === 0 || drivers.length === 0}
                  >
                    Calculate Routes <ArrowRight />
                  </Button>
                </div>
              </>
            </TabsContent>
          </Tabs>
          <div className="flex lg:hidden">
            <BottomSheet title="Plan">
              <DriversTab />
              <StopsTab />
            </BottomSheet>

            <BottomSheet
              title="Calculate"
              isDisabled={locations.length === 0 || drivers.length === 0}
              handleOnClick={calculateOptimalPaths}
            >
              <CalculationsTab />
            </BottomSheet>

            <Button
              className="w-full"
              variant={"ghost"}
              disabled={isRouteDataMissing}
              onClick={openTrackingPage}
            >
              Track
            </Button>
          </div>
          <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
        </section>
      </RouteLayout>
    </>
  );
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
//         destination: `/tools/routing/${newDepot.id}?welcome=true`,
//         permanent: false,
//       },
//     };
//   } else {
//     //Redirect to owned or allowed
//     const depotId = ownedDepot?.id ?? allowedDepots[0]?.id ?? "";

//     return {
//       redirect: {
//         destination: `/tools/routing/${depotId}`,
//         permanent: false,
//       },
//     };
//   }
// };
export default RoutingPage;
