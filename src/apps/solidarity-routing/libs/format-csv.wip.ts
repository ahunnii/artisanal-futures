import { uniqueId } from "lodash";
import type {
  DriverVehicleBundle,
  VersionOneClientCSV,
  VersionOneDriverCSV,
} from "../types.wip";

export const formatDriverSheetRow = (
  data: VersionOneDriverCSV
): DriverVehicleBundle => ({
  driver: {
    id: uniqueId("driver_"),
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
    capacity: data.default_capacity ?? 100,
    maxTasks: data.default_stops ?? 10,
    maxTravelTime: minutesToSeconds(data.default_travel_time ?? 60),
    maxDistance: data.default_distance ?? 100,
    shiftStart: militaryTimeToUnixSeconds(data.default_shift_start ?? "09:00"),
    shiftEnd: militaryTimeToUnixSeconds(data.default_shift_end ?? "17:00"),
    breaks: parseDefaultBreaks(data),
    // breaks: data?.default_breaks
    //   .split(";")
    //   ?.filter((value: string) => !isNaN(+value))
    //   ?.filter(
    //     (item: string) => item !== undefined || item !== "" || item !== null
    //   )
    //   ?.map((breakSlot: string) => {
    //     return {
    //       id: parseInt(uniqueId()),
    //       duration: minutesToSeconds(breakSlot ?? 30),
    //       start: militaryTimeToUnixSeconds(data.default_shift_start ?? "09:00"),
    //       end: militaryTimeToUnixSeconds(data.default_shift_end ?? "17:00"),
    //     };
    //   }) ?? [
    //   {
    //     id: parseInt(uniqueId()),
    //     duration: minutesToSeconds(30),
    //     start: militaryTimeToUnixSeconds("09:00"),
    //     end: militaryTimeToUnixSeconds("17:00"),
    //   },
    // ],
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

export const formatClientSheetRow = (data: VersionOneClientCSV) => ({
  client: {
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
    type: "regular",
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

export function militaryTimeToUnixSeconds(militaryTime: string): number {
  // Split the input military time string into hours and minutes
  const [hours, minutes] = militaryTime.split(":").map(Number);

  // Create a new Date object with a fixed date (e.g., Jan 1, 1970) and set hours and minutes
  const date = new Date(1970, 0, 1, hours, minutes);

  // Convert the date to Unix seconds by dividing the time in milliseconds by 1000
  const unixSeconds = Math.floor(date.getTime() / 1000);

  return unixSeconds;
}

export function unixSecondsToMilitaryTime(unixSeconds: number): string {
  // Create a new Date object using the provided Unix seconds
  const date = new Date(unixSeconds * 1000);

  // Extract hours and minutes from the Date object
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the hours and minutes to ensure they have leading zeros if needed
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  // Concatenate hours and minutes with a colon to get the military time string
  const militaryTime = `${formattedHours}:${formattedMinutes}`;

  return militaryTime;
}

export function minutesToSeconds(minutesString: string | number): number {
  if (typeof minutesString === "number") return minutesString * 60;

  // Parse the input string to a number
  const minutes = parseInt(minutesString, 10);

  // Check if the parsed value is a valid number
  if (isNaN(minutes)) {
    throw new Error(
      "Invalid input. Please provide a valid number as a string."
    );
  }

  // Convert minutes to seconds
  const seconds = minutes * 60;

  return seconds;
}

export function secondsToMinutes(seconds: string | number): number {
  // Parse the input to ensure it's a valid number
  const parsedSeconds =
    typeof seconds === "string" ? parseInt(seconds, 10) : seconds;

  // Check if the parsed value is a valid number
  if (isNaN(parsedSeconds)) {
    throw new Error(
      "Invalid input. Please provide a valid number as a string or number."
    );
  }

  // Convert seconds to minutes
  const minutes = parsedSeconds / 60;

  return minutes;
}
