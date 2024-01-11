import type { FC } from "react";
import { cn } from "~/utils/styles";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  handleOnChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
/**
 * Button for uploading a file on change. Currently accepts CSV files.
 */
const UploadBtn: FC<IProps> = ({ handleOnChange, className }) => {
  return (
    <label className={cn("flex w-full cursor-pointer text-center", className)}>
      <span className="inline-flex h-10 w-full items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium ring-offset-background transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50">
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
