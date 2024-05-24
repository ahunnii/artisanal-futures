import * as Papa from "papaparse";
import toast from "react-hot-toast";

export const parseSpreadSheet = <T, R>({
  file,
  parser,
  onComplete,
}: {
  file: File;
  parser: (data: T) => R;
  onComplete: (data: R[]) => Promise<void>;
}) => {
  try {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length) {
          console.error("CSV Parsing errors: ", results.errors);
          toast.error(
            "There was an issue parsing your file. Please try again later."
          );
          return;
        }

        const parsedData = results.data.map((row: unknown) => parser(row as T));
        void onComplete(parsedData as unknown as R[]);
      },
    });
  } catch (e) {
    throw new Error(e as string);
  }
};
