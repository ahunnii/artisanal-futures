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
        <button
          className="w-full rounded-md bg-indigo-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75"
          onClick={getRoutes}
        >
          {optimization ? "Regenerate" : "Generate"} my routes
        </button>
      </div>
      {optimization && (
        <div className="my-5 flex max-h-[calc(100vh-70px-70px-96px)]  flex-col gap-y-4 overflow-y-auto text-center">
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
    </>
  );
};

export default CalculationsTab;
