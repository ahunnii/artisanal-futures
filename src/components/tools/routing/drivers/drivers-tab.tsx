import DriverCard from "~/components/tools/routing/drivers/driver_card";
import DriverSheet from "~/components/tools/routing/drivers/driver_sheet";

import { useDrivers } from "~/hooks/routing/use-drivers";

import FileUpload from "~/components/tools/routing/ui/FileUpload";
import TabOptions, {
  ImportOptionsBtn,
} from "~/components/tools/routing/ui/tab_options";

import { ScrollArea } from "~/components/ui/scroll-area";
import DriverMinimalCard from "./driver-minimal-card";

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

      <DriverSheet driver={activeDriver} />

      <div className="flex h-full w-full grow flex-col justify-start gap-4 overflow-y-auto p-4 py-3 ">
        {drivers.length > 0 &&
          drivers.map((driver, idx) => (
            <DriverCard key={idx} driver={driver} />
          ))}
      </div>
    </>
  );
};

export const DriversDynamicTab = () => {
  const { drivers } = useDrivers((state) => state);
  return (
    <>
      <div className="flex flex-col px-4">
        <div className="flex items-center justify-between">
          <h2 className="scroll-m-20 text-xl font-semibold tracking-tight">
            Drivers{" "}
            <span className="rounded-lg border border-slate-300 px-2">
              {drivers?.length ?? 0}
            </span>
          </h2>
          {drivers?.length !== 0 && <ImportOptionsBtn type="driver" />}
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
            <>
              <DriverMinimalCard key={idx} driver={driver} />
            </>
          ))}
      </ScrollArea>
    </>
  );
};

export default DriversTab;
