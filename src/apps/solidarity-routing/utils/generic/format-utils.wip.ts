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

export const metersToMiles = (meters: number): number => {
  return meters / 1609.344;
};

export const milesToMeters = (miles: number): number => {
  return miles * 1609.344;
};
