import { uniqueId } from "lodash";
import {
  ClientJobBundle,
  StopFormValues,
  jobTypeSchema,
  type VersionOneClientCSV,
} from "../../types.wip";
import {
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "../generic/format-utils.wip";

export const formatJobFormDataToBundle = (
  data: StopFormValues
): ClientJobBundle => ({
  client: {
    id: data.clientId ?? uniqueId("client_"),

    email: data.email ?? "",
    phone: data.phone ?? undefined,
    name: data.name ?? "",
    addressId: data.clientAddressId ?? uniqueId("address_"),
    address: {
      formatted: data?.clientAddress?.formatted ?? data?.address?.formatted,
      latitude: data?.clientAddress?.latitude ?? data?.address?.latitude,
      longitude: data?.clientAddress?.longitude ?? data?.address?.longitude,
    },
  },
  job: {
    id: data?.id ?? uniqueId("job_"),
    addressId: data?.addressId ?? uniqueId("address_"),
    clientId: data?.clientId ?? undefined,

    address: {
      formatted: data?.address?.formatted,
      latitude: data?.address?.latitude,
      longitude: data?.address?.longitude,
    },

    type: data.type,
    prepTime: minutesToSeconds(data?.prepTime ?? 0),
    priority: Number(data?.priority) ?? 0,
    serviceTime: minutesToSeconds(data?.serviceTime ?? 0),
    timeWindowStart: militaryTimeToUnixSeconds(data.timeWindowStart),
    timeWindowEnd: militaryTimeToUnixSeconds(data.timeWindowEnd),

    notes: data?.notes ?? "",
    order: data?.order ?? "",
  },
});

export const formatClientSheetRowToBundle = (data: VersionOneClientCSV) => ({
  client: {
    id: uniqueId("client_"),
    name: data.name ?? "",
    address: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    email: data.email ?? "",
    phone: data.phone ?? undefined,
  },
  job: {
    id: uniqueId("job_"),
    type: jobTypeSchema.parse("DELIVERY"),
    address: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    serviceTime: minutesToSeconds(data.service_time ?? 10),
    prepTime: minutesToSeconds(data.prep_time ?? 10),
    priority: Number(data.priority) ?? 1,
    timeWindowStart: militaryTimeToUnixSeconds(data.time_start ?? "09:00"),
    timeWindowEnd: militaryTimeToUnixSeconds(data.time_end ?? "17:00"),
    notes: data.notes ?? "",
    order: data.order ?? "",
  },
});
