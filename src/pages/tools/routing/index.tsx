import { format } from "date-fns";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import DriversTab, {
  DriversDynamicTab,
} from "~/components/tools/routing/drivers/drivers-tab";
import CalculationsTab, {
  CalculationsDynamicTab,
} from "~/components/tools/routing/solutions/calculations_tab";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";

import StopsTab, {
  StopsDynamicTab,
} from "~/components/tools/routing/stops/stops_tab";
import RouteLayout from "~/layouts/route-layout";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import { ArrowRight, CalendarIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/map-sheet";

import { useDrivers } from "~/hooks/routing/use-drivers";
import useRouteOptimization from "~/hooks/routing/use-route-optimization";
import { useStops } from "~/hooks/routing/use-stops";

import DriverSheet from "~/components/tools/routing/drivers/driver_sheet";
import FulfillmentSheet from "~/components/tools/routing/stops/fulfillment-sheet";
import { cn } from "~/utils/styles";
const LazyRoutingMap = dynamic(
  () => import("~/components/tools/routing/map/routing-map"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);
/**
 * Page component that allows users to generate routes based on their input.
 */
const RoutingPage = () => {
  const { locations, activeLocation } = useStops((state) => state);
  const { drivers, activeDriver } = useDrivers((state) => state);

  const { getRoutes } = useRouteOptimization();
  const [tabValue, setTabValue] = useState("plan");

  return (
    <>
      <Head>
        <title>Routing Optimization | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />{" "}
      </Head>

      <FulfillmentSheet stop={activeLocation} />
      <DriverSheet driver={activeDriver} />

      <RouteLayout>
        <section className="flex flex-1 flex-row border-2 ">
          <Tabs
            defaultValue="plan"
            value={tabValue}
            onValueChange={setTabValue}
            className="flex flex-col gap-4 lg:w-5/12 xl:w-3/12"
          >
            <TabsList className=" flex ">
              <TabsTrigger value="plan" className="w-full">
                Plan
              </TabsTrigger>
              <TabsTrigger
                value="calculate"
                className="w-full"
                disabled={locations.length === 0 || drivers.length === 0}
                onClick={() => {
                  setTabValue("calculate");
                  void getRoutes();
                }}
              >
                Calculate
              </TabsTrigger>{" "}
            </TabsList>
            <TabsContent value="plan" asChild>
              <>
                <PageHeader />
                <DriversDynamicTab />
                <StopsDynamicTab />
                <div className=" flex h-16 items-center justify-end bg-white p-4">
                  <Button
                    onClick={() => {
                      setTabValue("calculate");
                      void getRoutes();
                    }}
                    className="gap-2"
                    disabled={locations.length === 0 || drivers.length === 0}
                  >
                    Calculate Routes <ArrowRight />
                  </Button>
                </div>
              </>
            </TabsContent>
            <TabsContent value="calculate" asChild>
              <>
                <CalculationsDynamicTab />
                <div className=" flex h-16 items-center justify-end bg-white p-4">
                  <Button
                    onClick={() => {
                      setTabValue("calculate");
                      void getRoutes();
                    }}
                    className="gap-2"
                    disabled={locations.length === 0 || drivers.length === 0}
                  >
                    Calculate Routes <ArrowRight />
                  </Button>
                </div>
              </>
            </TabsContent>
          </Tabs>
          <section className="z-0 flex w-full flex-col lg:w-7/12 xl:w-9/12">
            <LazyRoutingMap />
          </section>
        </section>
      </RouteLayout>
    </>
  );
};

const PageHeader = () => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  return (
    <div className="flex flex-col space-y-2 md:flex-row md:items-center md:justify-between ">
      {/* <h2 className="hidden text-3xl font-bold tracking-tight md:flex">
        Dashboard
      </h2> */}
      {/* <div className="flex  items-center space-x-2">
        <div className="flex w-full flex-col  md:w-auto">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                disabled
                className={cn(
                  "w-full pl-3 text-left font-normal md:w-[240px] ",
                  !selectedDate && "text-muted-foreground"
                )}
              >
                {selectedDate ? (
                  format(selectedDate, "PPP")
                ) : (
                  <span>Pick a date</span>
                )}
                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(e) => {
                  setSelectedDate(e!);
                }}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div> */}
    </div>
  );
};

export default RoutingPage;
