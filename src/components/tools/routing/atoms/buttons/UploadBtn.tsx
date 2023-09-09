import type { FC } from "react";

interface IProps {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
/**
 * Button for uploading a file on change. Currently accepts CSV files.
 */
const UploadBtn: FC<IProps> = ({ handleOnChange }) => {
  return (
    <label className="flex w-full cursor-pointer text-center">
      <span className="w-full cursor-pointer rounded-md bg-slate-500 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
        Upload...
      </span>
      <input
        type="file"
        accept=".csv"
        className="hidden"
        onChange={handleOnChange}
      />
    </label>
  );
};
export default UploadBtn;
