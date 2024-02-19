import { ScrollArea } from "~/components/ui/scroll-area";

import { DriverCard } from "~/apps/solidarity-routing/components/drivers-section/driver-card";

import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";

import { DriverVehicleSheetBtn } from "../sheet-driver/driver-vehicle-sheet-btn";

const DriversTab = () => {
  const driverBundles = useDriverVehicleBundles();

  if (driverBundles.isDataLoading) return null;

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex scroll-m-20 gap-3 text-xl font-semibold tracking-tight">
            Drivers{" "}
            <span className="rounded-lg border border-slate-300 px-2 text-base">
              {driverBundles?.data.length ?? 0}
            </span>
          </h2>

          <DriverVehicleSheetBtn />
        </div>

        {driverBundles.data?.length === 0 && (
          <p className="pb-4 pt-2 text-sm text-muted-foreground">
            No drivers have been added to this route yet.
          </p>
        )}
      </div>

      {!driverBundles.isDataLoading && driverBundles.data && (
        <ScrollArea className="px-4">
          {driverBundles.data.length > 0 &&
            driverBundles.data.map((bundle) => (
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
