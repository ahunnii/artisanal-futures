import type { FC } from "react";
import type { Driver, RouteData } from "../../types";

type IStopProps = {
  vehicle?: Driver;
  route?: RouteData;
};

// Popup shown inside map when a stop is clicked
const DriverPopup: FC<IStopProps> = ({ vehicle, route }) => {
  const description = JSON.parse(route?.description ?? "{}");

  const name = vehicle?.name ?? description?.name ?? "Driver";

  const address = vehicle?.address ?? description?.address ?? "Not filled out";

  const details = vehicle?.details ?? description?.details ?? "Not filled out";

  return (
    <div className="flex flex-col space-y-2">
      <span className="block text-base font-bold capitalize">{name}</span>
      <span className="block">
        <span className="block font-semibold text-slate-600">
          Roundtrip Location
        </span>
        {address}
      </span>
      <span className=" block">
        <span className="block font-semibold text-slate-600">Notes</span>
        {details}
      </span>
    </div>
  );
};

export default DriverPopup;
// const { name } = JSON.parse(
//   vehicle?.route?.description ?? "{}"
// );

// const startTime = convertSecondsToTimeString(
//   vehicle?.route?.steps?.[0]?.arrival ?? 0
// );
// const endTime = convertSecondsToTimeString(
//   (vehicle?.route?.steps?.[0]?.arrival ?? 0) +
//     vehicle?.route?.setup +
//     vehicle?.route?.service +
//     vehicle?.route?.waiting_time +
//     vehicle?.route?.duration
// );
// const numberOfStops = vehicle?.route?.steps?.filter(
//   (step) => step.type === "job"
// ).length;

{
  /* <div className="flex flex-col space-y-2">
<span className="block text-base font-bold capitalize">
  {name ?? "Driver "}
</span>
<span className="block">
  <span className="block font-semibold text-slate-600">
    Route Details
  </span>
  Start {startTime} • End {endTime} • {numberOfStops}{" "}
  stops •{" "}
  {convertMetersToMiles(vehicle?.route?.distance)} miles
</span>
</div> */
}
