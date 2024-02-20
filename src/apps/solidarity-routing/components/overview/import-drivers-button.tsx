import { FilePlus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { Button } from "~/components/ui/button";
import { driverVehicleUploadOptions } from "../../data/driver-data";
import { useCreateDriver } from "../../hooks/drivers/CRUD/use-create-driver";
import { useReadDriver } from "../../hooks/drivers/CRUD/use-read-driver";
import { DriverVehicleBundle } from "../../types.wip";
import { FileUploadModal } from "../shared";

export const ImportDriversButton = () => {
  const { depotDrivers } = useReadDriver();
  const { createNewDrivers } = useCreateDriver();

  const fileUploadOptions = useMemo(() => {
    return driverVehicleUploadOptions({
      drivers: depotDrivers,
      setDrivers: createNewDrivers,
    });
  }, [depotDrivers, createNewDrivers]);

  return (
    <FileUploadModal<DriverVehicleBundle> {...fileUploadOptions}>
      <Button className="mx-0 flex gap-2 px-0 " variant={"link"}>
        <FilePlus />
        Import Drivers
      </Button>{" "}
    </FileUploadModal>
  );
};
