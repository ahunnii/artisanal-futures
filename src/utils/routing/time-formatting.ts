export const convertSecondsToMinutes = (seconds: number) => {
  return Math.round(seconds / 60);
};

export const convertSecondsToMinutesAndHours = (seconds: number) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  return {
    hours,
    minutes,
    formatted: `${hours > 0 ? `${hours}hr ` : ""} ${
      minutes > 0 ? `${minutes}min ` : ""
    }`,
  };
};
export const convertSecondsToHours = (seconds: number) => {
  return Math.floor(seconds / 3600);
};

export const convertTimeWindowToSeconds = (timeString: string) => {
  const arr: string[] = timeString.split(":");
  const seconds: number = parseInt(arr[0]!) * 3600 + parseInt(arr[1]!) * 60;
  return seconds;
};

export const convertSecondsToTime = (seconds: number) => {
  // Ensure the seconds are between 0 and 86400 (0 <= seconds < 86400)
  seconds = seconds % 86400;

  // Calculate the hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  // const remainingSeconds = seconds % 60;

  // Convert to 12-hour format and determine AM or PM
  let period = "AM";
  let adjustedHours = hours;
  if (hours >= 12) {
    period = "PM";
    if (hours > 12) {
      adjustedHours = hours - 12;
    }
  } else if (hours === 0) {
    adjustedHours = 12;
  }

  // Format the time string as HH:MM:SS AM/PM
  const formattedTime = `${adjustedHours.toString().padStart(2, "0")}:${minutes
    .toString()
    // .padStart(2, "0")}:${remainingSeconds
    // .toString()
    .padStart(2, "0")} ${period}`;

  return formattedTime;
};

// type TimeComponents = {
//   hours: number;
//   minutes: number;
//   seconds: number;
//   formatted: string;
// };

export const convertSecondsToComponents = (seconds: number) => {
  // Calculate the hours, minutes, and remaining seconds
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  // Return the time components as an object
  return {
    hours,
    minutes,
    seconds: remainingSeconds,
    formatted:
      seconds === 0
        ? "0min"
        : `${hours > 0 ? `${hours}hr ` : ""} ${
            minutes > 0 ? `${minutes}min ` : ""
          }`,
  };
};
export function getCurrentDateFormatted(): string {
  // Create a new Date object for the current date and time
  const currentDate = new Date();

  // Array of days and months to get names instead of numbers
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Get the day of the week, month, and the date
  const day = days[currentDate.getDay()];
  const month = months[currentDate.getMonth()];
  const date = currentDate.getDate();

  // Return the formatted string
  return `${day}, ${month} ${date}`;
}
