import { createHash } from "crypto";

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

export function unixSecondsToStandardTime(seconds: number): string {
  // Create a new Date object using the provided Unix seconds
  const date = new Date(seconds * 1000);

  // Extract hours and minutes from the Date object
  const hours = date.getHours();
  const minutes = date.getMinutes();

  // Format the hours and minutes to ensure they have leading zeros if needed
  const formattedHours = hours.toString().padStart(2, "0");
  const formattedMinutes = minutes.toString().padStart(2, "0");

  //Add AM or PM
  const hour = parseInt(formattedHours);
  const amOrPm = hour >= 12 ? "PM" : "AM";

  // Concatenate hours and minutes with a colon to get the time string
  const time = `${formattedHours}:${formattedMinutes}`;

  return time + " " + amOrPm;
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

export const metersToMiles = (meters: number): number => {
  return meters / 1609.344;
};

export const milesToMeters = (miles: number): number => {
  return miles * 1609.344;
};

export function cuidToNumber(cuid: string): number {
  // Assuming cuid is a string that contains a numeric value
  // You might want to parse the actual numeric part from the cuid
  const numericPart = cuid.replace(/[^0-9]/g, "");

  // Convert the numeric part to a number
  const numericValue = parseInt(numericPart, 10);

  // Return the resulting number
  return numericValue;
}

function hashCode(s: string): number {
  let hash = 0;
  if (s.length === 0) return hash;
  for (let i = 0; i < s.length; i++) {
    const char = s.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}

export function cuidToUniqueNumber(cuid: string): number {
  // Use the hashCode function to convert the cuid to a unique number
  const uniqueNumber = hashCode(cuid);

  // Ensure the result is a positive number
  return Math.abs(uniqueNumber);
}

export function numberStringToPhoneFormat(input: string) {
  if (input.length === 11 && input.startsWith("1")) {
    input = input.slice(1);
  }

  input = input.replace(/\D/g, "");
  const size = input.length;
  if (size > 0) {
    input = "(" + input;
  }
  if (size > 3) {
    input = input.slice(0, 4) + ") " + input.slice(4, 11);
  }
  if (size > 6) {
    input = input.slice(0, 9) + "-" + input.slice(9);
  }
  return input;
}

export function phoneFormatStringToNumber(input: string) {
  if (input.length === 11 && input.startsWith("1")) {
    input = input.slice(1);
  }

  return input.replace(/\D/g, "");
}

export const cuidToIndex = (cuid: string): number => {
  const COLORS_ARRAY_SIZE = 19;
  // Calculate SHA-256 hash digest
  const hashDigest = createHash("sha256").update(cuid).digest("hex");
  // Convert digest to integer
  const hashInt = parseInt(hashDigest, 16);
  // Map the hash integer to the range of the array size
  const index = hashInt % COLORS_ARRAY_SIZE;
  return index;
};
