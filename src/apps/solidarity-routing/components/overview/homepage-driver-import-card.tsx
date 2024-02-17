import { Truck } from "lucide-react";
import type { FC } from "react";
import { driverVehicleUploadOptions } from "../../data/driver-data";
import { useCreateDriver } from "../../hooks/drivers/CRUD/use-create-driver";
import { useReadDriver } from "../../hooks/drivers/CRUD/use-read-driver";

import type { DriverVehicleBundle, UploadOptions } from "../../types.wip";
import { FileUploadModal } from "../shared/file-upload-modal.wip";
import {
  HomePageOverviewImportBtn,
  type HomePageImportBtnProps,
} from "../shared/homepage-overview-import-btn";

type UploadButtonOptions<T> = {
  button: HomePageImportBtnProps;
  fileUpload: UploadOptions<T> | null;
};

export const HomepageDriverImportCard: FC = () => {
  const { routeDrivers, depotDrivers } = useReadDriver();
  const { createNewDrivers } = useCreateDriver();

  const driverImportButtonProps = {
    button: {
      Icon: Truck,
      caption: "Add your drivers from spreadsheet",
      isProcessed: depotDrivers.length > 0,
    },
    fileUpload: driverVehicleUploadOptions({
      drivers: routeDrivers,
      setDrivers: createNewDrivers,
    }),
  } as UploadButtonOptions<DriverVehicleBundle>;

  return (
    <FileUploadModal<DriverVehicleBundle>
      {...driverImportButtonProps.fileUpload!}
    >
      <span>
        <HomePageOverviewImportBtn {...driverImportButtonProps.button} />
      </span>
    </FileUploadModal>
  );
};
