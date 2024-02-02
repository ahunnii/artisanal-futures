import { uniqueId } from "lodash";
import { jobTypeSchema, type VersionOneClientCSV } from "../../types.wip";
import {
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "../generic/format-utils.wip";

export const formatClientSheetRowToBundle = (data: VersionOneClientCSV) => ({
  client: {
    id: uniqueId("client_"),
    name: data.name ?? "",
    address: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    email: data.email ?? undefined,
    phone: data.phone ?? undefined,
  },
  job: {
    id: uniqueId("client_"),
    type: jobTypeSchema.parse("DELIVERY"),
    address: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    serviceTime: minutesToSeconds(data.default_service_time ?? 10),
    prepTime: minutesToSeconds(data.default_prep_time ?? 10),
    priority: minutesToSeconds(data.default_priority ?? 1),
    timeWindowStart: militaryTimeToUnixSeconds(
      data.default_time_start ?? "09:00"
    ),
    timeWindowEnd: militaryTimeToUnixSeconds(data.default_time_end ?? "17:00"),
    notes: data.notes ?? "",
  },
});
