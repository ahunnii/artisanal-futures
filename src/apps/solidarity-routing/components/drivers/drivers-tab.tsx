import { ScrollArea } from "~/components/ui/scroll-area";

import DriverCard from "~/apps/solidarity-routing/components/drivers/driver-card";

import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { DriverOptionsBtn } from "./driver-options-btn.wip";

const DriversTab = () => {
  const drivers = useDriverVehicleBundles();

  if (drivers.isDataLoading) return null;

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex scroll-m-20 gap-3 text-xl font-semibold tracking-tight">
            Drivers{" "}
            <span className="rounded-lg border border-slate-300 px-2 text-base">
              {drivers?.data.length ?? 0}
            </span>
          </h2>

          <DriverOptionsBtn />
        </div>

        {drivers.data?.length === 0 && (
          <p className="pb-4 pt-2   text-sm text-muted-foreground">
            No drivers have been added to this route yet.
          </p>
        )}
      </div>

      {!drivers.isDataLoading && drivers.data && (
        <ScrollArea className="px-4">
          {drivers.data.length > 0 &&
            drivers.data.map((bundle) => (
              <DriverCard
                key={bundle?.vehicle.id}
                id={bundle?.vehicle.id}
                name={bundle.driver?.name ?? "New Driver"}
              />
            ))}
        </ScrollArea>
      )}
    </>
  );
};

export default DriversTab;
