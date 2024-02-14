import type {
  DriverFormValues,
  DriverVehicleBundle,
  VersionOneDriverCSV,
} from "~/apps/solidarity-routing/types.wip";

import { uniqueId } from "lodash";
import {
  milesToMeters,
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

export const formatDriverFormDataToBundle = (
  data: DriverFormValues
): DriverVehicleBundle => ({
  driver: {
    id: data.id,
    type: "FULL_TIME",
    email: data.email,
    phone: data.phone,
    name: data.name,
    addressId: data.addressId,
    address: {
      formatted: data.address.formatted,
      latitude: data.address.latitude,
      longitude: data.address.longitude,
    },
  },
  vehicle: {
    id: data?.vehicleId ?? uniqueId("vehicle_"),
    startAddressId: data?.startAddressId ?? uniqueId("address_"),
    endAddressId: data?.endAddressId ?? uniqueId("address_"),
    startAddress: {
      formatted: data?.startAddress?.formatted ?? data.address.formatted,
      latitude: data?.startAddress?.latitude ?? data.address.latitude,
      longitude: data?.startAddress?.longitude ?? data.address.longitude,
    },

    endAddress: {
      formatted:
        data?.endAddress?.formatted ??
        data?.startAddress?.formatted ??
        data.address.formatted,
      latitude:
        data?.endAddress?.latitude ??
        data?.startAddress?.latitude ??
        data.address.latitude,
      longitude:
        data?.endAddress?.longitude ??
        data?.startAddress?.longitude ??
        data.address.longitude,
    },
    type: data.type,
    maxTravelTime: minutesToSeconds(data?.maxTravelTime ?? 0),
    maxTasks: Number(data?.maxTasks) ?? 0,
    maxDistance: milesToMeters(data?.maxDistance ?? 0),
    shiftStart: militaryTimeToUnixSeconds(data.shiftStart),
    shiftEnd: militaryTimeToUnixSeconds(data.shiftEnd),
    breaks:
      data?.breaks.map((b) => ({
        ...b,
        duration: minutesToSeconds(b.duration),
      })) ?? [],
    capacity: data?.capacity ?? 0,
  },
});

export const formatDriverSheetRowToBundle = (
  data: VersionOneDriverCSV
): DriverVehicleBundle => ({
  driver: {
    id: uniqueId("driver_"),
    type: "FULL_TIME",
    name: data.name ?? "",

    address: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    email: data.email ?? "",
    phone: data.phone ?? "",
  },
  vehicle: {
    id: uniqueId("vehicle_"),
    type: "DRIVER",
    startAddress: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    endAddress: {
      formatted: data.address ?? "",
      latitude: 0,
      longitude: 0,
    },
    capacity: data.default_capacity ?? 100,
    maxTasks: data.default_stops ?? 10,
    maxTravelTime: minutesToSeconds(data.default_travel_time ?? 60),
    maxDistance: milesToMeters(data.default_distance ?? 100),
    shiftStart: militaryTimeToUnixSeconds(data.default_shift_start ?? "09:00"),
    shiftEnd: militaryTimeToUnixSeconds(data.default_shift_end ?? "17:00"),
    breaks: parseDefaultBreaks(data),
  },
});

const parseDefaultBreaks = (csvRow: VersionOneDriverCSV) => {
  const { default_breaks, default_shift_start, default_shift_end } = csvRow;

  // Check if default_breaks is not empty
  if (default_breaks && typeof default_breaks === "string") {
    // Split the string by semicolon to get an array of numbers as strings
    const breaksArray = default_breaks.split(";");

    // Use map to convert the array of strings into an array of numbers
    const numbersArray = breaksArray.map((breakValue) => ({
      id: parseInt(uniqueId()),
      duration: minutesToSeconds(parseInt(breakValue, 30)),

      start: militaryTimeToUnixSeconds(default_shift_start ?? "09:00"),
      end: militaryTimeToUnixSeconds(default_shift_end ?? "17:00"),
    }));

    // Filter out NaN values in case there are non-numeric strings
    const filteredNumbersArray = numbersArray.filter(
      (value) => !isNaN(value.duration)
    );

    return filteredNumbersArray;
  }

  return [];
};
