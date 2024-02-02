import { uniqueId } from "lodash";
import { jobTypeSchema, type ClientJobBundle } from "../../types.wip";
import {
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "../../utils/generic/format-utils.wip";

export const stopData = (lat: number, lng: number): ClientJobBundle => {
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
const clientJobDefaults = {
  serviceTime: minutesToSeconds(60),
  prepTime: minutesToSeconds(2),
  priority: 1,
  timeWindowStart: militaryTimeToUnixSeconds("09:00"),
  timeWindowEnd: militaryTimeToUnixSeconds("09:00"),
  notes: "",
};
