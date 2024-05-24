import { uniqueId } from "lodash";

import {
  jobTypeSchema,
  type ClientJobBundle,
  type UploadOptions,
} from "~/apps/solidarity-routing/types.wip";
import { handleClientSheetUpload } from "~/apps/solidarity-routing/utils/client-job/parse-clients.wip";
import {
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

interface IUploadOptions {
  jobs: ClientJobBundle[];
  setJobs: ({
    jobs,
    addToRoute,
  }: {
    jobs: ClientJobBundle[];
    addToRoute?: boolean;
  }) => void;
}

export const clientJobDataForNewLatLng = (
  lat: number,
  lng: number
): ClientJobBundle => {
  return {
    client: {
      id: uniqueId("client_"),
      name: "New Client",
      address: {
        formatted: "Address via LatLng",
        latitude: lat,
        longitude: lng,
      },
      email: "",
      phone: "",
    },
    job: {
      id: uniqueId("job_"),
      address: {
        formatted: "Address via LatLng",
        latitude: lat,
        longitude: lng,
      },
      type: jobTypeSchema.parse("DELIVERY"),
      serviceTime: clientJobDefaults.serviceTime,
      prepTime: clientJobDefaults.prepTime,
      priority: clientJobDefaults.priority,
      timeWindowStart: clientJobDefaults.timeWindowStart,
      timeWindowEnd: clientJobDefaults.timeWindowEnd,
      notes: "",
    },
  };
};
export const clientJobDefaults = {
  serviceTime: minutesToSeconds(60),
  prepTime: minutesToSeconds(2),
  priority: 1,
  timeWindowStart: militaryTimeToUnixSeconds("09:00"),
  timeWindowEnd: militaryTimeToUnixSeconds("09:00"),
  notes: "",
};

export const clientJobUploadOptions = ({
  jobs,
  setJobs,
}: IUploadOptions): UploadOptions<ClientJobBundle> => ({
  type: "job" as keyof ClientJobBundle,
  parseHandler: handleClientSheetUpload,
  handleAccept: ({ data }) => {
    setJobs({
      jobs: data,
      addToRoute: true,
    });
  },
  currentData: jobs,
});
