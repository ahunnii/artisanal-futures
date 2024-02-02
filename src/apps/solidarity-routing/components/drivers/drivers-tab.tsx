import { ScrollArea } from "~/components/ui/scroll-area";

import DriverCard from "~/apps/solidarity-routing/components/drivers/driver-card";

import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { DriverOptionsBtn } from "../driver-options-btn.wip";

const DriversTab = () => {
  const { drivers } = useDriverVehicleBundles();

  if (drivers.isLoading) return null;

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex scroll-m-20 gap-3 text-xl font-semibold tracking-tight">
            Drivers{" "}
            <span className="rounded-lg border border-slate-300 px-2 text-base">
              {drivers?.all.length ?? 0}
            </span>
          </h2>

          <DriverOptionsBtn />
        </div>

        {drivers.all?.length === 0 && (
          <p className="pb-4 pt-2   text-sm text-muted-foreground">
            No drivers have been added to this route yet.
          </p>
        )}
      </div>

      {!drivers.isLoading && drivers.all && (
        <ScrollArea className="px-4">
          {drivers.all.length > 0 &&
            drivers.all.map((bundle) => (
              <DriverCard
                key={bundle.driver.id}
                id={bundle.driver.id}
                name={bundle.driver.name}
              />
            ))}
        </ScrollArea>
      )}
    </>
  );
};

export default DriversTab;
