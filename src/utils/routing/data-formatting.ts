import type {
  Break,
  Driver,
  Stop,
  TimeWindow,
} from "~/components/tools/routing/types";
import { convertTimeWindowToSeconds } from "./time-formatting";

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
    contact_info: stop?.contact_info ?? "",
    description: stop?.description ?? "",
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

// const convertMilitaryTimeStringToStandardTimeString = (timeString: string) => {
//   const time = timeString.split(":");
//   const hours = parseInt(time[0]);
//   const minutes = parseInt(time[1]);
//   const ampm = hours >= 12 ? "pm" : "am";
//   const standardHours = hours % 12;
//   const standardMinutes = minutes < 10 ? `0${minutes}` : minutes;
//   return `${standardHours}:${standardMinutes} ${ampm}`;
// };

export const convertSecondsToTimeString = (seconds: number) => {
  const time = convertSecondsToMilitaryTimeString(seconds);
  return convertSecondsToMilitaryTimeString(seconds);
};

export const parseDescriptionData = (des: string) => {
  const { name, address, contact_info, description } = JSON.parse(des ?? {});

  return { name, address, contact_info, description };
};
