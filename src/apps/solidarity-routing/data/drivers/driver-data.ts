import { uniqueId } from "lodash";
import {
  driverTypeSchema,
  type DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import {
  milesToMeters,
  militaryTimeToUnixSeconds,
  minutesToSeconds,
} from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

export const driverData = (lat: number, lng: number): DriverVehicleBundle => {
  return {
    driver: {
      id: uniqueId("driver_"),
      name: "New Driver",
      email: "",
      phone: "",

      address: {
        formatted: "Address via LatLng",
        latitude: lat,
        longitude: lng,
      },
    },
    vehicle: {
      id: uniqueId("vehicle_"),
      type: driverTypeSchema.parse("TEMP"),
      shiftStart: driverVehicleDefaults.shiftStart,
      shiftEnd: driverVehicleDefaults.shiftEnd,
      breaks: driverVehicleDefaults.breaks,
      capacity: driverVehicleDefaults.capacity,
      maxTravelTime: driverVehicleDefaults.maxTravelTime,
      maxTasks: driverVehicleDefaults.maxTasks,
      maxDistance: driverVehicleDefaults.maxDistance,

      notes: "",
      cargo: "",
    },
  };
};

const driverVehicleDefaults = {
  shiftStart: militaryTimeToUnixSeconds("09:00"),
  shiftEnd: militaryTimeToUnixSeconds("17:00"),
  breaks: [
    {
      id: parseInt(uniqueId()),
      duration: minutesToSeconds(30),
      start: militaryTimeToUnixSeconds("09:00"),
      end: militaryTimeToUnixSeconds("09:00"),
    },
  ],
  capacity: 10,
  maxTravelTime: minutesToSeconds(60),
  maxTasks: 10,
  maxDistance: milesToMeters(100),
  notes: "",
  cargo: "",
};
