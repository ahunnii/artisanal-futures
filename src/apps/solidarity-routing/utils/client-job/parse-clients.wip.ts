import { parseSpreadSheet } from "../../libs/parse-csv.wip";
import geocodingService from "../../services/autocomplete";
import {
  ClientJobBundle,
  FileUploadHandler,
  VersionOneClientCSV,
} from "../../types.wip";
import { formatClientSheetRowToBundle } from "./format-clients.wip";

export const handleClientSheetUpload: FileUploadHandler<ClientJobBundle> = ({
  event,
  setIsLoading,
  callback,
}) => {
  setIsLoading(true);

  parseSpreadSheet<VersionOneClientCSV, ClientJobBundle>({
    file: event.target.files![0]!,
    parser: formatClientSheetRowToBundle,
    onComplete: async (data: ClientJobBundle[]) => {
      const revisedClients = await Promise.all(
        data.map(async (clientJobBundle) => {
          const address = await geocodingService.geocodeByAddress(
            clientJobBundle.client.address!.formatted
          );
          return {
            ...clientJobBundle,
            client: {
              ...clientJobBundle.client,
              address: {
                // ...driverVehicleBundle.driver.address,
                ...address,
              },
            },
            job: {
              ...clientJobBundle.job,
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

      callback(revisedClients ?? []);
    },
  });
};
