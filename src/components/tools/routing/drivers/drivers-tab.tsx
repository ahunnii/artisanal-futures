import { ScrollArea } from "~/components/ui/scroll-area";

import DriverCard from "~/components/tools/routing/drivers/driver-card";
import TabOptions from "~/components/tools/routing/ui/tab-options";

import { useDrivers } from "~/hooks/routing/use-drivers";
import OptionsBtn from "../ui/options-btn";

const DriversDynamicTab = () => {
  const { drivers } = useDrivers((state) => state);

  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Drivers
            <span className="rounded-lg border border-slate-300 px-2">
              {drivers?.length ?? 0}
            </span>
          </h2>
          {drivers?.length !== 0 && <OptionsBtn type="driver" />}
        </div>
        {drivers?.length === 0 && (
          <p>No drivers have been added to this route yet.</p>
        )}

        {drivers?.length === 0 && (
          <TabOptions
            type="driver"
            className="flex-col items-stretch  shadow-none"
          />
        )}
      </div>

      <ScrollArea className=" px-4">
        {drivers.length > 0 &&
          drivers.map((driver, idx) => (
            <DriverCard key={idx} driver={driver} />
          ))}
      </ScrollArea>
    </>
  );
};

export default DriversDynamicTab;
