import type { FC } from "react";
import type { Driver, RouteData } from "~/apps/solidarity-routing/types";

type IStopProps = {
  vehicle?: Driver;
  route?: RouteData;
};

// Popup shown inside map when a stop is clicked
const DepotPopup: FC<IStopProps> = ({ vehicle, route }) => {
  const description = JSON.parse(route?.description ?? "{}");
  const address = vehicle?.address ?? description?.address ?? "Not filled out";
  return (
    <div className="flex flex-col space-y-2">
      <span className="block text-base font-bold capitalize">Depot</span>
      <span className="block">
        <span className="block font-semibold text-slate-600">
          Roundtrip Location
        </span>
        {address}
      </span>
    </div>
  );
};

export default DepotPopup;
