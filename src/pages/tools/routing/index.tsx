import { Tab } from "@headlessui/react";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import DriverSheet from "~/components/tools/routing/drivers/driver_sheet";

import DriversTab from "~/components/tools/routing/drivers/drivers_tab";
import CalculationsTab from "~/components/tools/routing/solutions/calculations_tab";
import FulfillmentSheet from "~/components/tools/routing/stops/fulfillment_sheet";
import StopsTab from "~/components/tools/routing/stops/stops_tab";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { useStops } from "~/hooks/routing/use-stops";

import ToolLayout from "~/layouts/tool-layout";

import { classNames } from "~/utils/styles";

const LazyRoutingMap = dynamic(
  () => import("~/components/tools/routing/map/RoutingMap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

/**
 * Page component that allows users to generate routes based on their input.
 */
const RoutingPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const tabBtnStyle =
    "w-full py-2.5 text-sm font-medium leading-5 text-blue-700 ring-white ring-opacity-60 ring-offset-2 ring-offset-blue-400 focus:outline-none ";

  return (
    <>
      <Head>
        <title>Routing Optimization | Artisanal Futures</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />{" "}
      </Head>
      <ToolLayout>
        <section className="flex w-full flex-grow flex-col  justify-between lg:w-5/12 xl:w-4/12 2xl:w-3/12">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="mx-auto mb-5 flex w-full  space-x-1 border-b-4 border-b-indigo-500/20 pb-0 pt-3">
              <Tab
                key={"tab-0"}
                className={({ selected }) =>
                  classNames(
                    tabBtnStyle,
                    selected
                      ? " mb-0 border-b-2 border-b-indigo-500 font-bold"
                      : " hover:bg-indigo-700/20 hover:text-white"
                  )
                }
              >
                Stops
              </Tab>
              <Tab
                key={"tab-1"}
                className={({ selected }) =>
                  classNames(
                    tabBtnStyle,
                    selected
                      ? " mb-0 border-b-2 border-b-indigo-500 font-bold"
                      : " hover:bg-indigo-700/20 hover:text-white"
                  )
                }
              >
                Drivers
              </Tab>
              <Tab
                key={"tab-2"}
                className={({ selected }) =>
                  classNames(
                    tabBtnStyle,
                    selected
                      ? " mb-0 border-b-2 border-b-indigo-500 font-bold"
                      : " hover:bg-indigo-700/20 hover:text-white"
                  )
                }
              >
                Calculate
              </Tab>
            </Tab.List>
            <Tab.Panels className="flex  h-fit flex-grow flex-col overflow-y-hidden">
              <Tab.Panel
                key={0}
                className="flex h-full flex-col rounded-xl p-3"
              >
                <StopsTab />
              </Tab.Panel>
              <Tab.Panel
                key={1}
                className="flex h-full flex-col rounded-xl p-3"
              >
                <DriversTab />
              </Tab.Panel>
              <Tab.Panel
                key={2}
                className="flex h-full flex-col rounded-xl p-3"
              >
                <CalculationsTab />
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </section>
        <section className="relative z-0  flex aspect-square w-full flex-grow overflow-hidden  pl-8 lg:aspect-auto lg:w-7/12 xl:w-9/12 2xl:w-9/12">
          <LazyRoutingMap test={"teet"} />
        </section>
      </ToolLayout>
    </>
  );
};

export default RoutingPage;
