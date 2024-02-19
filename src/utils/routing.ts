// import axios from "axios";
// import type { MutableRefObject } from "react";

// // Convert time string from 24hr to 12hr
// export const convertTime = (time: string) => {
//   const [hours, minutes] = time.split(":");
//   return `${parseInt(hours!) % 12 || 12}:${minutes} ${
//     parseInt(hours!) >= 12 ? "PM" : "AM"
//   }`;
// };
// export const formatTime = (seconds: number): string => {
//   const date = new Date(seconds * 1000);
//   const hours = date.getUTCHours();
//   const minutes = date.getUTCMinutes();
//   const amOrPm = hours >= 12 ? "PM" : "AM";
//   const formattedHours = hours % 12 || 12;
//   const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
//   return `${formattedHours}:${formattedMinutes} ${amOrPm}`;
// };

// // convert seconds to minutes
// export const convertMinutes = (seconds: number) => {
//   const minutes = Math.floor(seconds / 60);
//   return minutes;
// };
// export const convertSecondsToTime = (seconds: number) => {
//   let hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor((seconds % 3600) / 60);
//   const ampm = hours >= 12 ? "PM" : "AM";
//   hours = hours % 12;
//   hours = hours ? hours : 12; // the hour '0' should be '12'
//   const minutesStr = minutes < 10 ? "0" + minutes : minutes;
//   const strTime = hours + ":" + minutesStr + " " + ampm;
//   return strTime;
// };

// const fetchAddressData = async (query: string) => {
//   const response = await axios.get(
//     "https://nominatim.openstreetmap.org/search",
//     {
//       params: {
//         q: query,
//         format: "json",
//       },
//     }
//   );

//   const data = response.data;

//   return data;
// };

// const lookupAddress = async (lat: string, lon: string) => {
//   const response = await axios.get(
//     "https://nominatim.openstreetmap.org/reverse",
//     {
//       params: {
//         lat,
//         lon,
//         format: "json",
//       },
//     }
//   );

//   const data = response.data;

//   return data;
// };
// export { fetchAddressData, lookupAddress };

// export const getFormValues = (
//   formRef: MutableRefObject<HTMLFormElement | null>
// ) => {
//   const form = formRef.current;
//   const inputs = form ? Array.from(form.elements) : [];

//   const values: Record<string, unknown> = {};
//   inputs.forEach((element: Element) => {
//     if (element instanceof HTMLInputElement) {
//       const input = element;
//       if (input.name) {
//         values[input.name] = input.value;
//       }
//       if (input.type === "checkbox" || input.type === "radio") {
//         values[input.name] = input.checked;
//       }
//     }
//   });

//   return values;
// };
// export const getUniqueKey = async (obj: unknown) => {
//   // Convert the object to a string using JSON.stringify
//   const objString = JSON.stringify(obj);

//   // Hash the string using a hash function (here, we use the built-in SHA-256 algorithm)
//   const hashBuffer = await crypto.subtle.digest(
//     "SHA-256",
//     new TextEncoder().encode(objString)
//   );
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray
//     .map((b) => b.toString(16).padStart(2, "0"))
//     .join("");

//   // Return the hashed string as the unique key
//   return hashHex;
// };
