import geocodingService from "~/apps/solidarity-routing/services/autocomplete";
import type {
  ClientJobBundle,
  FileUploadHandler,
  FileUploadFetch,
  VersionOneClientCSV,
} from "~/apps/solidarity-routing/types.wip";
import { formatClientSheetRowToBundle } from "~/apps/solidarity-routing/utils/client-job/format-clients.wip";
import { parseSpreadSheet } from "~/apps/solidarity-routing/utils/generic/parse-csv.wip";

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
            clientJobBundle.job.address.formatted
          );

          const client = clientJobBundle.client
            ? {
                ...clientJobBundle.client,
                address: {
                  ...address,
                },
              }
            : undefined;

          return {
            client: client,
            job: {
              ...clientJobBundle.job,
              address: {
                ...address,
              },
            },
          };
        })
      ).catch((err) => {
        console.log(err);
      });
      setIsLoading(false);
      const tableData =
        revisedClients?.map((bundle) => {
          return {
            name: bundle?.client?.name ?? `Job #${bundle.job.id}`,
            address: bundle.job.address.formatted,
            email: bundle?.client?.email ?? "",
          };
        }) ?? [];
      callback({ data: revisedClients ?? [], tableData });
    },
  });
};

export const handleClientSheetFetch: FileUploadFetch<ClientJobBundle> = ({
  csvData,
  setIsLoading,
  callback,
}) => {
  setIsLoading(true);

  parseSpreadSheet<VersionOneClientCSV, ClientJobBundle>({
    file: new File([csvData], "upload.csv", { type: "text/csv" }),
    parser: formatClientSheetRowToBundle,
    onComplete: async (data: ClientJobBundle[]) => {
      const revisedClients = await Promise.all(
        data.map(async (clientJobBundle) => {
          const address = await geocodingService.geocodeByAddress(
            clientJobBundle.job.address.formatted
          );

          const client = clientJobBundle.client
            ? {
                ...clientJobBundle.client,
                address: {
                  ...address,
                },
              }
            : undefined;

          return {
            client: client,
            job: {
              ...clientJobBundle.job,
              address: {
                ...address,
              },
            },
          };
        })
      ).catch((err) => {
        console.log(err);
      });
      setIsLoading(false);
      const tableData =
        revisedClients?.map((bundle) => {
          return {
            name: bundle?.client?.name ?? `Job #${bundle.job.id}`,
            address: bundle.job.address.formatted,
            email: bundle?.client?.email ?? "",
          };
        }) ?? [];
      callback({ data: revisedClients ?? [], tableData });
    },
  });
};
