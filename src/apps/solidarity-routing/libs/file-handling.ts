import { uniqueId } from "lodash";
import * as Papa from "papaparse";
import type {
  Break,
  Driver,
  FileData,
  Stop,
} from "~/apps/solidarity-routing/types";

import type { DriverCSVData, StopCSVData } from "~/types";
import { DriverVehicleBundle, VersionOneDriverCSV } from "../types.wip";
import { parseSpreadSheet } from "../utils/generic/parse-csv.wip";
import { formatDriverSheetRow } from "./format-csv.wip";

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
  callback: (data: T) => void
) => {
  if (data instanceof File) {
    if (type === "driver") {
      parseSpreadSheet<VersionOneDriverCSV, DriverVehicleBundle>({
        file: data,
        parser: formatDriverSheetRow,
        onComplete: callback,
      });
    } else {
      parseCSVFile(data, type, callback);
    }

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

// export const

export const parseIncomingDBData = async (data: Blob) => {
  const arrayBuffer = await data.arrayBuffer();
  const jsonString = new TextDecoder("utf-8").decode(arrayBuffer);
  const jsonObject = JSON.parse(jsonString);

  console.log(jsonObject);

  return jsonObject;
};
