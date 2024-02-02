import { parseSpreadSheet } from "../../libs/parse-csv.wip";
import geocodingService from "../../services/autocomplete";
import type {
  DriverVehicleBundle,
  FileUploadHandler,
  VersionOneDriverCSV,
} from "../../types.wip";
import { formatDriverSheetRowToBundle } from "./format-drivers.wip";

export const handleDriverSheetUpload: FileUploadHandler<
  DriverVehicleBundle
> = ({ event, setIsLoading, callback }) => {
  setIsLoading(true);

  parseSpreadSheet<VersionOneDriverCSV, DriverVehicleBundle>({
    file: event.target.files![0]!,
    parser: formatDriverSheetRowToBundle,

    onComplete: async (data: DriverVehicleBundle[]) => {
      const revisedDrivers = await Promise.all(
        data.map(async (driverVehicleBundle) => {
          const address = await geocodingService.geocodeByAddress(
            driverVehicleBundle.driver.address.formatted
          );

          return {
            ...driverVehicleBundle,
            driver: {
              ...driverVehicleBundle.driver,
              address: {
                // ...driverVehicleBundle.driver.address,
                ...address,
              },
            },
          };
        })
      ).catch((err) => {
        console.log(err);
      });

      setIsLoading(false);

      callback(revisedDrivers ?? []);
    },
  });
};
