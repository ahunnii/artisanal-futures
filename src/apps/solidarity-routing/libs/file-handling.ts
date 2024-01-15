import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import type {
  Break,
  Driver,
  FileData,
  Stop,
} from "~/apps/solidarity-routing/types";

import type { DriverCSVData, StopCSVData } from "~/types";

export const parseDriver = (data: DriverCSVData) => ({
  id: parseInt(uniqueId()),
  address: data.address,
  name: data.name,
  max_travel_time: data.max_travel_time,
  time_window: {
    startTime: data.time_window?.split("-")[0],
    endTime: data.time_window?.split("-")[1],
  },
  max_stops: data.max_stops,

  break_slots: data.break_slots?.split(";").map((bs: string) => {
    const [time, service] = bs.split(" (");
    const window = time?.split(",").map((tw: string) => {
      const [startTime, endTime] = tw.split("-");
      return { startTime, endTime };
    });
    const breakLength = service?.split(")")[0]?.split(" min")[0];

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
  prep_time_duration: data?.prep_time_duration,
  time_windows: data.time_windows?.split(", ").map((tw: string) => {
    const [startTime, endTime] = tw.split("-");

    return { startTime, endTime };
  }),
  priority: data.priority,
  coordinates: { latitude: data.latitude, longitude: data.longitude },
});

const parseFunction = (type: string, data: unknown) => {
  if (type === "driver") return parseDriver(data as DriverCSVData);
  else return parseStop(data as StopCSVData);
};

export const parseCSVFile = <T extends Stop | Driver>(
  file: File,
  type: "driver" | "stop",
  onComplete: (data: T[]) => void
) => {
  try {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("CSV Parsing errors: ", results.errors);
          return;
        }

        const parsedData = results.data.map((row) => parseFunction(type, row));

        onComplete(parsedData as unknown as T[]);
      },
    });
  } catch (e) {
    throw new Error(e as string);
  }
};

export const handleIncomingData = async <T extends Stop | Driver>(
  data: File | string | object,
  type: "driver" | "stop",
  callback: (data: T[]) => void
) => {
  if (data instanceof File) {
    parseCSVFile(data, type, callback);
    return;
  }

  if (typeof data === "string") {
    const fetchedData = await fetch(data)
      .then((res) => res.json())
      .catch((error) => {
        console.error("Error fetching csv:", error);
      });

    console.log(fetchedData);
    updateDataVersion(fetchedData as FileData);
    const parsedData = fetchedData.map((data: T) => {
      return {
        ...data,
        id: parseInt(uniqueId()),
      };
    });
    callback(parsedData as T[]);
    return;
  }

  if (typeof data === "object" && data instanceof Array) {
    const fetchedData = data.map((driver) => {
      const break_slots =
        type === "driver"
          ? driver.break_slots.map((slot: Break) => {
              return {
                ...slot,
                id: parseInt(uniqueId()),
              };
            })
          : null;

      return {
        ...driver,
        id: parseInt(uniqueId()),
        break_slots,
      };
    });
    callback(fetchedData as T[]);
    return;
  }
};

export const parseIncomingDBData = async (data: Blob) => {
  const arrayBuffer = await data.arrayBuffer();
  const jsonString = new TextDecoder("utf-8").decode(arrayBuffer);
  const jsonObject = JSON.parse(jsonString);

  console.log(jsonObject);

  return jsonObject;

  // if (jsonObject.steps && jsonObject.steps.length > 0) {
  //   for (const step of jsonObject.steps) {
  //     if (step.location)
  //       try {
  //         const { display_name } = await lookupAddress(
  //           String(step?.location[1]),
  //           String(step?.location[0])
  //         );
  //         addresses.push(display_name as string);
  //       } catch (error) {
  //         addresses.push("Address not found");
  //         console.error("Error while reverse geocoding:", error);
  //       }
  //   }
  // }
};

export const updateDataVersion = (data: FileData) => {
  if (data?.lat) console.log("lat exists");
  else console.log("lat does not exist");
};
