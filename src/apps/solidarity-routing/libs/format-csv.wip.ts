import type { VersionOneClientCSV, VersionOneDriverCSV } from "../types.wip";

export const formatDriverSheetRow = (data: VersionOneDriverCSV) => ({
  driver: {
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
    type: "delivery",
    capacity: data.default_capacity ?? 100,
    maxTasks: data.default_stops ?? 10,
    maxTravelTime: minutesToSeconds(data.default_travel_time ?? 60),
    maxDistance: data.default_distance ?? 100,
    shiftStart: militaryTimeToUnixSeconds(data.default_shift_start ?? "09:00"),
    shiftEnd: militaryTimeToUnixSeconds(data.default_shift_end ?? "17:00"),
    breaks:
      data.default_breaks
        .split(";")
        .filter((value) => !isNaN(+value))
        .map((breakSlot: string) => {
          if (Number(breakSlot))
            return {
              duration: minutesToSeconds(breakSlot),
              start: militaryTimeToUnixSeconds(
                data.default_shift_start ?? "09:00"
              ),
              end: militaryTimeToUnixSeconds(data.default_shift_end ?? "17:00"),
            };
        }) ?? [],
  },
});

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

function militaryTimeToUnixSeconds(militaryTime: string): number {
  // Split the input military time string into hours and minutes
  const [hours, minutes] = militaryTime.split(":").map(Number);

  // Create a new Date object with a fixed date (e.g., Jan 1, 1970) and set hours and minutes
  const date = new Date(1970, 0, 1, hours, minutes);

  // Convert the date to Unix seconds by dividing the time in milliseconds by 1000
  const unixSeconds = Math.floor(date.getTime() / 1000);

  return unixSeconds;
}

function minutesToSeconds(minutesString: string | number): number {
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
