import { useDrivers } from "~/hooks/routing/use-drivers";

import DriverCard from "~/components/tools/routing/drivers/driver_card";
import DriverSheet from "~/components/tools/routing/drivers/driver_sheet";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions from "~/components/tools/routing/ui/tab_options";
import { ScrollArea } from "~/components/ui/scroll-area";
import DriverSelector from "./driver-selector";

/**
 * Tab container component that allows users to add, edit, and delete drivers.
 */
const DriversTab = () => {
  const { drivers, activeDriver } = useDrivers((state) => state);

  return (
    <>
      <TabOptions type="driver" />

      {drivers.length == 0 && (
        <div className="flex w-full ">
          <FileUpload dataType="driver" />
        </div>
      )}

      <DriverSheet driver={activeDriver} />

      <DriverSelector />

      <ScrollArea className="h-full ">
        <div className="space-y-2 p-2">
          {drivers.length > 0 &&
            drivers.map((driver, idx) => (
              <DriverCard key={idx} driver={driver} />
            ))}
        </div>
      </ScrollArea>
    </>
  );
};

export default DriversTab;
