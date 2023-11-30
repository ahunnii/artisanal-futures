/* eslint-disable @typescript-eslint/no-explicit-any */
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useRef, useState } from "react";

import { ArrowRight, X } from "lucide-react";

import { AnimatePresence, motion } from "framer-motion";
import DriverSheet from "~/components/tools/routing/drivers/driver-sheet";
import DriversDynamicTab from "~/components/tools/routing/drivers/drivers-tab";
import CalculationsTab from "~/components/tools/routing/solutions/calculations-tab";
import FulfillmentSheet from "~/components/tools/routing/stops/fulfillment-sheet";
import StopsDynamicTab from "~/components/tools/routing/stops/stops-tab";
import { Button } from "~/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "~/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import RouteLayout from "~/layouts/route-layout";

import { ScrollArea } from "~/components/ui/scroll-area";
import { useDrivers } from "~/hooks/routing/use-drivers";
import useRouteOptimization from "~/hooks/routing/use-route-optimization";
import { useStops } from "~/hooks/routing/use-stops";

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
  const [tabValue, setTabValue] = useState("plan");

  const { locations } = useStops((state) => state);
  const { drivers } = useDrivers((state) => state);

  const { getRoutes } = useRouteOptimization();

  const calculateOptimalPaths = () => {
    setTabValue("calculate");
    void getRoutes();
  };

  const openTrackingPage = () =>
    window.open("/tools/routing/tracking", "_blank");

  const isRouteDataMissing = locations.length === 0 || drivers.length === 0;

  const [open, setOpen] = useState<boolean>(false);
  const bottomSheetRef = useRef(null);
  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      function handleClickOutside(event: MouseEvent) {
        if (ref.current && !ref.current.contains(event.target)) {
          setOpen(false);
        }
      }
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }
  useOutsideAlerter(bottomSheetRef);

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

      <FulfillmentSheet />
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
                <DriversDynamicTab />
                <StopsDynamicTab />
                <div className=" flex h-16 items-center justify-end bg-white p-4">
                  <Button
                    onClick={() => {
                      setTabValue("calculate");
                      void getRoutes();
                    }}
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

          <LazyRoutingMap className="max-md:aspect-square lg:w-7/12 xl:w-9/12" />
          <div className="flex lg:hidden">
            {" "}
            <>
              <Button
                onClick={() => setOpen(true)}
                variant={"ghost"}
                className="w-full"
              >
                Plan
              </Button>
            </>
            <motion.div
              animate={
                open
                  ? { opacity: 0.6, zIndex: 3 }
                  : { opacity: 0, display: "none" }
              }
              initial={{ opacity: 0 }}
              className="fixed bottom-0 left-0 right-0 top-0 h-full w-screen bg-black"
            />
            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="content"
                  initial="collapsed"
                  animate="open"
                  exit="collapsed"
                  variants={{
                    open: { y: 0, height: "auto" },
                    collapsed: { y: "100%", height: 0 },
                  }}
                  transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                  className="fixed bottom-0 left-0 right-0 z-10 w-full rounded-t-3xl border-2 border-b-0 border-gray-50 bg-white shadow-[0px_-8px_20px_-6px_rgba(0,0,0,0.3)]"
                >
                  <div ref={bottomSheetRef} className="h-[60vh] p-4">
                    <div className="mb-2 flex justify-end">
                      <X className="w-6" onClick={() => setOpen(false)} />
                    </div>
                    <ScrollArea className="h-96 gap-5 ">
                      <DriversDynamicTab />
                      <StopsDynamicTab />
                    </ScrollArea>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant={"ghost"} className="w-full">
                  Plan
                </Button>
              </SheetTrigger>
              <SheetContent
                side={"bottom"}
                className=" h-[60vh] rounded-t-3xl p-4"
              >
                <div className="relative flex h-full flex-col space-y-3 overflow-auto">
                  <DriversDynamicTab />
                  <StopsDynamicTab />
                </div>
              </SheetContent>
            </Sheet>
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  onClick={calculateOptimalPaths}
                  className="gap-2"
                  disabled={locations.length === 0 || drivers.length === 0}
                  variant={"ghost"}
                >
                  Calculate
                </Button>
              </SheetTrigger>
              <SheetContent
                side={"left"}
                className="flex w-full max-w-full flex-col  overflow-y-scroll sm:w-full sm:max-w-full md:max-w-md lg:max-w-lg"
              >
                <SheetHeader>
                  <SheetTitle>Calculate</SheetTitle>
                </SheetHeader>{" "}
                <>
                  <CalculationsTab />
                  <div className=" flex h-16 items-center justify-end bg-white p-4">
                    {/* <Button
                      onClick={calculateOptimalPaths}
                      className="gap-2"
                      disabled={locations.length === 0 || drivers.length === 0}
                    >
                      Calculate Routes <ArrowRight />
                    </Button> */}
                  </div>
                </>
              </SheetContent>
            </Sheet>
            <Button
              className="w-full"
              variant={"ghost"}
              disabled={isRouteDataMissing}
              onClick={openTrackingPage}
            >
              Track
            </Button>
          </div>
        </section>
      </RouteLayout>
    </>
  );
};

export default RoutingPage;
