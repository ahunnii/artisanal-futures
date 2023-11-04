import { useDrivers } from "~/hooks/routing/use-drivers";

import DriverCard from "~/components/tools/routing/drivers/driver_card";
import DriverSheet from "~/components/tools/routing/drivers/driver_sheet";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions from "~/components/tools/routing/ui/tab_options";

/**
 * Tab container component that allows users to add, edit, and delete drivers.
 */
const DriversTab = () => {
  const { drivers, activeDriver } = useDrivers((state) => state);

  return (
    <>
      <TabOptions type="driver" />

      {drivers.length == 0 && (
        <div className="flex w-full flex-grow">
          <FileUpload dataType="driver" />
        </div>
      )}

      {/* <DriverSheet driver={activeDriver} /> */}

      <div className="flex h-full w-full grow flex-col justify-start gap-4 overflow-y-auto p-4 py-3 ">
        {drivers.length > 0 &&
          drivers.map((driver, idx) => (
            <DriverCard key={idx} driver={driver} />
          ))}
      </div>
    </>
  );
};

export default DriversTab;
