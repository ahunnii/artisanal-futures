import { useRouteStore } from "~/store";
import { parseDriver, parseStop } from "~/utils/routing";
import { classNames } from "~/utils/styles";

import * as Papa from "papaparse";

import { useMemo, useState, type FC } from "react";
import { Button } from "~/components/ui/button";

type DragEvent = React.DragEvent<HTMLDivElement>;

interface IProps {
  dataType: "stop" | "driver";
  autofillDemo?: () => void;
}

/**
 * File upload component for data uploads, alerting users of the file upload process (using CSV) to add stops and drivers to the route.
 */
const FileUpload: FC<IProps> = ({ dataType, autofillDemo }) => {
  const { dragActive, onDragOver, onDrop, onDragEnter, onDragLeave } =
    useDrag();

  const setData = useRouteStore((state) => state.setData);

  const createParsedEntry = useMemo(() => {
    if (dataType === "stop") return parseStop;
    else return parseDriver;
  }, [dataType]);

  const csvFile = useMemo(() => {
    return dataType === "stop" ? "/stops.csv" : "/drivers.csv";
  }, [dataType]);

  const parseCSV = (e: DragEvent) => {
    try {
      const file = Array.from(e.dataTransfer.files).filter(
        (file: File) => file.type === "text/csv"
      )[0]!;

      Papa.parse(file, {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: (results) => {
          const parsedData = results.data.map(
            (row: unknown) => createParsedEntry(row) as unknown
          );

          setData(dataType === "stop" ? "locations" : "drivers", parsedData);
        },
      });
    } catch (e) {
      console.error("There was an error uploading your CSV file.");
    }
  };

  return (
    <div
      className={classNames(
        dragActive ? "border-blue-500" : "",
        " flex h-1/2 flex-col  items-center justify-center border-4  border-dashed border-slate-300 bg-slate-100 py-5 text-center"
      )}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, parseCSV)}
      onDragEnter={onDragEnter}
      onDragLeave={onDragLeave}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="h-16 w-16 text-slate-500"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
        />
      </svg>

      <h3 className="mt-2 text-2xl font-bold capitalize text-slate-700">
        Upload {dataType}s
      </h3>
      <p className="mx-auto  p-3 text-slate-600">
        You don&apos;t have any {dataType}s yet. Upload a CSV to import them.
        Drag and drop or click <em className="font-semibold">Upload</em> above.
        Click{" "}
        <a href={csvFile} download className="font-semibold text-blue-500">
          here
        </a>{" "}
        for an example.{" "}
        {autofillDemo && (
          <span>
            You can also autofill an example set to get started{" "}
            <Button
              variant={"link"}
              onClick={autofillDemo}
              className="m-0 inline p-0 text-base text-blue-500"
            >
              here
            </Button>
            .
          </span>
        )}
      </p>
    </div>
  );
};

const useDrag = () => {
  const [dragActive, setDragActive] = useState<boolean>(false);

  const onDragOver = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDrop = (e: DragEvent, callback: (e: DragEvent) => void) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    callback(e);
  };

  const onDragEnter = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  const onDragLeave = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return {
    dragActive,
    onDragOver,
    onDrop,
    onDragEnter,
    onDragLeave,
  };
};

export default FileUpload;
