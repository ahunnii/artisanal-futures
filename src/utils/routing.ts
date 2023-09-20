import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import type { Driver, DriverCSVData, Location, StopCSVData } from "~/types";
// address: row.address.replace(/\\,/g, ",") was used to replace all the commas in the address with a backslash

type PossibleData = Driver | Location;

export const parseDriver = (data: DriverCSVData) => ({
  id: parseInt(uniqueId()),
  address: data.address,
  name: data.name,
  max_travel_time: data.max_travel_time,
  time_window: {
    startTime: data.time_window.split("-")[0],
    endTime: data.time_window.split("-")[1],
  },
  max_stops: data.max_stops,

  break_slots: data.break_slots.split(";").map((bs: string) => {
    const [time, service] = bs.split("(");
    const window = time?.split(",").map((tw: string) => {
      const [startTime, endTime] = tw.split("-");
      return { startTime, endTime };
    });
    const breakLength = service?.split(")")[0]?.split("min")[0];

    return {
      id: parseInt(uniqueId()),
      time_windows: window,
      service: breakLength,
    };
  }),
  coordinates: { latitude: data.latitude, longitude: data.longitude },
});

export const parseStop = (data: StopCSVData) => ({
  id: parseInt(uniqueId()),
  customer_name: data?.customer_name,
  address: data.address,
  drop_off_duration: data.drop_off_duration,
  time_windows: data.time_windows.split(",").map((tw: string) => {
    const [startTime, endTime] = tw.split("-");
    return { startTime, endTime };
  }),
  priority: data.priority,
  coordinates: { latitude: data.latitude, longitude: data.longitude },
});

export const parseCSVFile = (
  file: File,
  type: string,
  onComplete: (data: unknown) => void
) => {
  Papa.parse(file, {
    header: true,
    dynamicTyping: true,
    skipEmptyLines: true,
    complete: (results) => {
      const parse = type === "driver" ? parseDriver : parseStop;
      const parsedData: unknown[] = results.data.map((row: unknown) =>
        parse(row)
      );

      if (type === "driver") onComplete(parsedData as Driver[]);
      else if (type === "stop") onComplete(parsedData as Location[]);
    },
  });
};
export const jsonToFile = (data: object, filename: string) => {
  const jsonData = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });

  return new File([blob], filename, { type: "application/json" });
};

const getColor = (id: number) => {
  const colors: string[] = [
    "border-[#F56565]",
    "border-[#48BB78]",
    "border-[#ED8936]",
    "border-[#4299E1]",
    "border-[#ED8936]",
    "border-[#9F7AEA]",
    "border-[#4FD1C5]",
    "border-[#ED64A6]",
    "border-[#B6E63E]",
    "border-[#667EEA]",
    "border-[#D53F8C]",
    "border-[#2F855A]",
    "border-[#DD6B20]",
    "border-[#3182CE]",
    "border-[#DD6B20]",
    "border-[#805AD5]",
    "border-[#38B2AC]",
    "border-[#D53F8C]",
    "border-[#9BDD33]",
    "border-[#553C9A]",
    "border-[#C53030]",
    "border-[#276749]",
    "border-[#C05621]",
    "border-[#2B6CB0]",
    "border-[#C05621]",
    "border-[#6B46C1]",
    "border-[#319795]",
    "border-[#B83280]",
    "border-[#8CC63E]",
    "border-[#4C51BF]",
    "border-[#742A2A]",
    "border-[#22543D]",
    "border-[#9C4221]",
    "border-[#2C5282]",
    "border-[#9C4221]",
    "border-[#553C9A]",
    "border-[#2C7A7B]",
    "border-[#97266D]",
    "border-[#719E40]",
    "border-[#2A4365]",
    "border-[#718096]",
    "border-[#A0AEC0]",
    "border-[#CBD5E0]",
    "border-[#EDF2F7]",
    "border-[#F7FAFC]",
    "border-[#F0F4F8]",
    "border-[#FFFFFF]",
    "border-[#000000]",
  ];

  const hexColors: string[] = [
    "#F56565",
    "#48BB78",
    "#ED8936",
    "#4299E1",
    "#ED8936",
    "#9F7AEA",
    "#4FD1C5",
    "#ED64A6",
    "#B6E63E",
    "#667EEA",
    "#D53F8C",
    "#2F855A",
    "#DD6B20",
    "#3182CE",
    "#DD6B20",
    "#805AD5",
    "#38B2AC",
    "#D53F8C",
    "#9BDD33",
    "#553C9A",
    "#C53030",
    "#276749",
    "#C05621",
    "#2B6CB0",
    "#C05621",
    "#6B46C1",
    "#319795",
    "#B83280",
    "#8CC63E",
    "#4C51BF",
    "#742A2A",
    "#22543D",
    "#9C4221",
    "#2C5282",
    "#9C4221",
    "#553C9A",
    "#2C7A7B",
    "#97266D",
    "#719E40",
    "#2A4365",
    "#718096",
    "#A0AEC0",
    "#CBD5E0",
    "#EDF2F7",
    "#F7FAFC",
    "#F0F4F8",
    "#FFFFFF",
    "#000000",
  ];

  const shadowColors: string[] = [
    "shadow-[#F56565]",
    "shadow-[#48BB78]",
    "shadow-[#ED8936]",
    "shadow-[#4299E1]",
    "shadow-[#ED8936]",
    "shadow-[#9F7AEA]",
    "shadow-[#4FD1C5]",
    "shadow-[#ED64A6]",
    "shadow-[#B6E63E]",
    "shadow-[#667EEA]",
    "shadow-[#D53F8C]",
    "shadow-[#2F855A]",
    "shadow-[#DD6B20]",
    "shadow-[#3182CE]",
    "shadow-[#DD6B20]",
    "shadow-[#805AD5]",
    "shadow-[#38B2AC]",
    "shadow-[#D53F8C]",
    "shadow-[#9BDD33]",
    "shadow-[#553C9A]",
    "shadow-[#C53030]",
    "shadow-[#276749]",
    "shadow-[#C05621]",
    "shadow-[#2B6CB0]",
    "shadow-[#C05621]",
    "shadow-[#6B46C1]",
    "shadow-[#319795]",
    "shadow-[#B83280]",
    "shadow-[#8CC63E]",
    "shadow-[#4C51BF]",
    "shadow-[#742A2A]",
    "shadow-[#22543D]",
    "shadow-[#9C4221]",
    "shadow-[#2C5282]",
    "shadow-[#9C4221]",
    "shadow-[#553C9A]",
    "shadow-[#2C7A7B]",
    "shadow-[#97266D]",
    "shadow-[#719E40]",
    "shadow-[#2A4365]",
    "shadow-[#718096]",
    "shadow-[#A0AEC0]",
    "shadow-[#CBD5E0]",
    "shadow-[#EDF2F7]",
    "shadow-[#F7FAFC]",
    "shadow-[#F0F4F8]",
    "shadow-[#FFFFFF]",
    "shadow-[#000000]",
  ];

  const textColors: string[] = [
    "text-[#F56565]",
    "text-[#48BB78]",
    "text-[#ED8936]",
    "text-[#4299E1]",
    "text-[#ED8936]",
    "text-[#9F7AEA]",
    "text-[#4FD1C5]",
    "text-[#ED64A6]",
    "text-[#B6E63E]",
    "text-[#667EEA]",
    "text-[#D53F8C]",
    "text-[#2F855A]",
    "text-[#DD6B20]",
    "text-[#3182CE]",
    "text-[#DD6B20]",
    "text-[#805AD5]",
    "text-[#38B2AC]",
    "text-[#D53F8C]",
    "text-[#9BDD33]",
    "text-[#553C9A]",
    "text-[#C53030]",
    "text-[#276749]",
    "text-[#C05621]",
    "text-[#2B6CB0]",
    "text-[#C05621]",
    "text-[#6B46C1]",
    "text-[#319795]",
    "text-[#B83280]",
    "text-[#8CC63E]",
    "text-[#4C51BF]",
    "text-[#742A2A]",
    "text-[#22543D]",
    "text-[#9C4221]",
    "text-[#2C5282]",
    "text-[#9C4221]",
    "text-[#553C9A]",
    "text-[#2C7A7B]",
    "text-[#97266D]",
    "text-[#719E40]",
    "text-[#2A4365]",
    "text-[#718096]",
    "text-[#A0AEC0]",
    "text-[#CBD5E0]",
    "text-[#EDF2F7]",
    "text-[#F7FAFC]",
    "text-[#F0F4F8]",
    "text-[#FFFFFF]",
    "text-[#000000]",
  ];

  return {
    border: colors[id % colors.length],
    shadow: shadowColors[id % colors.length],
    fill: hexColors[id % hexColors.length],
    text: textColors[id % textColors.length],
  };
};

const getStyle = (feature: any) => {
  const textColorClass = getColor(feature.geometry.properties.color).fill;
  return {
    fillColor: "transparent",
    weight: 5,
    opacity: 1,
    color: textColorClass, //Outline color
    fillOpacity: 1,
  };
};
export { getColor, getStyle };

// Convert time string from 24hr to 12hr
export const convertTime = (time: string) => {
  const [hours, minutes] = time.split(":");
  return `${parseInt(hours) % 12 || 12}:${minutes} ${
    parseInt(hours) >= 12 ? "PM" : "AM"
  }`;
};
export const formatTime = (seconds: number): string => {
  const date = new Date(seconds * 1000);
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const amOrPm = hours >= 12 ? "PM" : "AM";
  const formattedHours = hours % 12 || 12;
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
};
function convertHMS(timeString: string) {
  const arr: string[] = timeString.split(":");
  const seconds: number = parseInt(arr[0]) * 3600 + parseInt(arr[1]) * 60;
  return seconds;
}

// convert seconds to minutes
export const convertMinutes = (seconds: number) => {
  let minutes = Math.floor(seconds / 60);
  return minutes;
};
export const convertSecondsToTime = (seconds: number) => {
  let hours = Math.floor(seconds / 3600);
  let minutes = Math.floor((seconds % 3600) / 60);
  let ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  let minutesStr = minutes < 10 ? "0" + minutes : minutes;
  let strTime = hours + ":" + minutesStr + " " + ampm;
  return strTime;
};

import axios from "axios";

const fetchAddressData = async (query: string) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/search",
    {
      params: {
        q: query,
        format: "json",
      },
    }
  );

  const data = response.data;

  return data;
};

const lookupAddress = async (lat: string, lon: string) => {
  const response = await axios.get(
    "https://nominatim.openstreetmap.org/reverse",
    {
      params: {
        lat,
        lon,
        format: "json",
      },
    }
  );

  const data = response.data;

  return data;
};
export { fetchAddressData, lookupAddress };

import { MutableRefObject } from "react";

export const getFormValues = (
  formRef: MutableRefObject<HTMLFormElement | null>
) => {
  const form = formRef.current;
  const inputs = form ? Array.from(form.elements) : [];

  const values: any = {};
  inputs.forEach((element: Element) => {
    if (element instanceof HTMLInputElement) {
      const input = element as HTMLInputElement;
      if (input.name) {
        values[input.name] = input.value;
      }
      if (input.type === "checkbox" || input.type === "radio") {
        values[input.name] = input.checked;
      }
    }
  });

  return values;
};
export const getUniqueKey = async (obj: Object) => {
  // Convert the object to a string using JSON.stringify
  const objString = JSON.stringify(obj);

  // Hash the string using a hash function (here, we use the built-in SHA-256 algorithm)
  const hashBuffer = await crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(objString)
  );
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Return the hashed string as the unique key
  return hashHex;
};
