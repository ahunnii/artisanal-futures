import type { FC } from "react";

type IStopProps = {
  name: string;
  address: string;
  type: "vehicle" | "job" | "depot";
};

// Popup shown inside map when a stop is clicked
export const MapPopup: FC<IStopProps> = ({ name, address, type }) => {
  return (
    <div className="flex flex-col space-y-2">
      <span className="block text-base font-bold capitalize">{name}</span>
      <span className="block">
        <span className="block font-semibold text-slate-600">
          Roundtrip Location
        </span>
        {address}
      </span>
    </div>
  );
};
