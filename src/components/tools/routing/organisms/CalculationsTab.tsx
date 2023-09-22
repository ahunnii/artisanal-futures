/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
import OptimizationRouteCard from "~/components/tools/routing/molecules/cards/OptimizationRouteCard";

import useOpenRoute from "~/hooks/useOpenRoute";
import { useRequestStore, useRouteStore } from "~/store";

/**
 * This component is responsible for displaying the calculated routes from the our own VROOM optimization server.
 */
const CalculationsTab = () => {
  const locations = useRouteStore((state) => state.locations);
  const drivers = useRouteStore((state) => state.drivers);

  const driversMap = new Map(drivers.map((obj) => [obj.id, obj]));
  const locationsMap = new Map(locations.map((obj) => [obj.id, obj]));

  const { getOptimization } = useOpenRoute();
  const optimization = useRequestStore((state) => state.optimization);
  const setOptimization = useRequestStore((state) => state.setOptimization);

  const getRoutes = () => {
    getOptimization()
      .then((data) => {
        setOptimization(data as any);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  return (
    <>
      <div className="mx-auto my-2 flex w-full items-center justify-center gap-4 bg-white p-3 shadow">
        {(locations.length === 0 || drivers.length === 0) && (
          <p>
            Make sure to add{" "}
            {locations.length === 0 && drivers.length === 0
              ? "stops and drivers"
              : locations.length === 0
              ? "stops"
              : drivers.length === 0
              ? "drivers"
              : ""}{" "}
            before you generate your routes.
          </p>
        )}
        <button
          className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 disabled:cursor-not-allowed disabled:bg-indigo-500/50"
          onClick={getRoutes}
          disabled={locations.length === 0 || drivers.length === 0}
        >
          {optimization ? "Regenerate" : "Generate"} my routes
        </button>
      </div>{" "}
      <div className="flex max-h-screen flex-grow overflow-y-auto ">
        {optimization && (
          <div className="my-5 flex h-full  w-full flex-col text-center">
            {optimization?.data?.routes.map((route) => (
              <OptimizationRouteCard
                route={route}
                drivers={driversMap}
                locations={locationsMap}
                key={route.vehicle}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default CalculationsTab;
