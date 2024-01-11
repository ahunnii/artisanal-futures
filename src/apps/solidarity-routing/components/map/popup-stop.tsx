import type { FC } from "react";
import type {
  StepData,
  Stop,
} from "../../../../components/tools/routing/types";

type IStopProps = {
  stop?: Stop;
  step?: StepData;
};

// Popup shown inside map when a stop is clicked
const StopPopup: FC<IStopProps> = ({ stop, step }) => {
  const description = JSON.parse(step?.description ?? "{}");

  const name =
    stop?.customer_name ?? description?.name ?? "Fulfillment Location";

  const address = stop?.address ?? description?.address ?? "Not filled out";

  const details = stop?.details ?? description?.details ?? "Not filled out";

  return (
    <div className="flex flex-col space-y-2">
      <span className="block text-base font-bold capitalize ">{name}</span>
      <span className="block">
        <span className="block font-semibold text-slate-600">
          Fulfillment Location
        </span>
        {address}
      </span>

      <span className=" block">
        <span className="block font-semibold text-slate-600">
          Fulfillment Details
        </span>
        {details}
      </span>
    </div>
  );
};

export default StopPopup;
