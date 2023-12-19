import polyline from "@mapbox/polyline";
import type {
  Break,
  Driver,
  Polyline,
  Stop,
  TimeWindow,
} from "~/components/tools/routing/types";
import {
  convertTimeFromMilitaryToStandard,
  convertTimeWindowToSeconds,
} from "./time-formatting";

export const convertMetersToMiles = (meters: number) => {
  return (meters / 1609.344).toFixed(1);
};

const formatBreak = (breakSlot: Break) => {
  const timeSlots = breakSlot.time_windows.map((tw) => [
    convertTimeWindowToSeconds(tw.startTime),
    convertTimeWindowToSeconds(tw.endTime),
  ]);

  return {
    ...breakSlot,
    time_windows: timeSlots,
    service: breakSlot.service * 60,
  };
};

const stringifyStopDescriptionData = (stop: Stop) => {
  const data = {
    name: stop.customer_name,
    address: stop.address,
    email: stop?.email ?? "",
    details: stop?.details ?? "",
  };

  return JSON.stringify(data);
};

const stringifyDriverDescriptionData = (driver: Driver) => {
  const data = {
    name: driver.name,
    address: driver.address,
    contact_info: driver?.contact_info ?? "",
    description: driver?.description ?? "",
  };

  return JSON.stringify(data);
};

export const convertStopToJob = (stop: Stop) => {
  return {
    id: stop.id,
    description: stringifyStopDescriptionData(stop),
    service: stop.drop_off_duration * 60,
    location: [stop.coordinates?.longitude, stop.coordinates?.latitude],
    skills: [1],
    priority: stop.priority,
    setup: stop.prep_time_duration * 60 || 0, //Adding fallback 0 for now due to csv not having that option for now..
    time_windows: stop.time_windows.map((window: TimeWindow) => [
      convertTimeWindowToSeconds(window.startTime),
      convertTimeWindowToSeconds(window.endTime),
    ]),
  };
};

export const convertDriverToVehicle = (driver: Driver) => {
  return {
    id: driver.id,
    profile: "car",
    description: stringifyDriverDescriptionData(driver),
    start: [driver.coordinates?.longitude, driver.coordinates?.latitude],
    end: [driver.coordinates?.longitude, driver.coordinates?.latitude],
    max_travel_time: driver.max_travel_time * 60,

    max_tasks: driver.max_stops,
    capacity: [250],
    skills: [1],
    breaks: driver.break_slots.map((tw) => formatBreak(tw)),
    time_window: [
      convertTimeWindowToSeconds(driver.time_window.startTime),
      convertTimeWindowToSeconds(driver.time_window.endTime),
    ],
  };
};

const convertSecondsToMilitaryTimeString = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  return `${hours > 0 ? `${hours}:` : ""}${minutes > 0 ? `${minutes}` : "00"}`;
};

export const convertSecondsToTimeString = (seconds: number) => {
  // const time = convertSecondsToMilitaryTimeString(seconds);
  return convertSecondsToMilitaryTimeString(seconds);
};

export const parseDescriptionData = (des: string) => {
  if (!des) return {};
  const { name, address, email, details } = JSON.parse(des ?? {});

  return { name, address, email, details };
};

export const convertToGeoJson = (geometry: string, color: number) => {
  const temp = polyline.toGeoJSON(geometry) as Polyline;

  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          ...temp,
          properties: { color },
        },
      },
    ],
  };
};

export const parseDataFromStop = (stop: Stop | null) => {
  if (!stop) return {};
  const priorityLevel =
    stop?.priority < 50 ? "Low" : stop?.priority < 100 ? "Normal" : "High";

  const formattedTimeWindows = stop?.time_windows?.map((tw) => {
    return {
      startTime: convertTimeFromMilitaryToStandard(tw.startTime),
      endTime: convertTimeFromMilitaryToStandard(tw.endTime),
    };
  });

  const parsedTimeWindows = stop?.time_windows?.map((tw) => [
    convertTimeWindowToSeconds(tw.startTime),
    convertTimeWindowToSeconds(tw.endTime),
  ]);

  return {
    name: stop?.customer_name ?? "Fulfillment",
    address: stop?.address.split(", United States")[0]?.split(", USA")[0] ?? "",
    duration: stop?.drop_off_duration ?? 5,
    prep: stop?.prep_time_duration ?? 0,
    priorityLevel,
    priorityValue: stop?.priority ?? 0,
    fulfillmentTimesFormatted: formattedTimeWindows,
    fulfillmentTimes: parsedTimeWindows,
    fulfillmentTimeValues: stop?.time_windows,

    latitude: stop?.coordinates?.latitude ?? 0,
    longitude: stop?.coordinates?.longitude ?? 0,

    email: stop?.email ?? "",
    details: stop?.details ?? "No details provided",
  };
};

export const parseDataFromDriver = (driver: Driver | null) => {
  if (!driver) return {};

  return {
    name: driver?.name ?? "Driver",
    address:
      driver?.address.split(", United States")[0]?.split(", USA")[0] ?? "",

    shiftFormatted: {
      startTime: convertTimeFromMilitaryToStandard(
        driver?.time_window?.startTime
      ),
      endTime: convertTimeFromMilitaryToStandard(driver?.time_window?.endTime),
    },

    shiftValues: driver?.time_window,
    shiftTimes: [
      convertTimeWindowToSeconds(driver?.time_window.startTime),
      convertTimeWindowToSeconds(driver?.time_window.endTime),
    ],

    breaks: driver?.break_slots ?? [],
    formattedBreaks: driver.break_slots.map((tw) => formatBreak(tw)),
    maxTravel: driver?.max_travel_time ?? 0,
    maxStops: driver?.max_stops ?? 0,

    latitude: driver?.coordinates?.latitude ?? 0,
    longitude: driver?.coordinates?.longitude ?? 0,

    email: driver?.email ?? "",
    details: driver?.details ?? "No details provided",
  };
};
