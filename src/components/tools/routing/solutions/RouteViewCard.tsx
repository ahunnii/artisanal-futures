import { Fragment, type FC } from "react";

import {
  convertMinutes,
  convertSecondsToTime,
  formatTime,
  getColor,
} from "~/utils/routing";

import type {
  CustomerResponseData,
  Step,
  VehicleInfo,
  VehicleResponseData,
} from "~/types";

interface OptimizationProps {
  route: VehicleInfo;
  drivers: Map<number, VehicleResponseData>;
  locations: Map<number, CustomerResponseData>;
}

const OptimizationRouteCard: FC<OptimizationProps> = ({
  route,
  drivers,
  locations,
}) => {
  const color = getColor(route.vehicle);

  const startTime = formatTime(route.steps[0]?.arrival ?? 0);
  const endTime = formatTime(route.steps[route.steps.length - 1]?.arrival ?? 0);

  return (
    <div
      className={" bg-slate-50 p-2  " + " shadow " + color.shadow}
      key={route.vehicle}
    >
      <div className="flex items-center justify-between">
        <p className="pb-2 font-bold text-slate-800">
          {" "}
          {drivers.get(route.vehicle)?.name} (
          <span>
            {startTime} to {endTime}
          </span>
          )
        </p>
      </div>
      {/* <h2 className="text-base font-bold text-slate-600 ">Route</h2> */}
      <ul
        role="list"
        className="list-disc space-y-3 pl-5 text-slate-500 marker:text-sky-400"
      >
        <li>
          <span className="flex w-full text-sm font-bold">{startTime}</span>{" "}
          <span className="font-base flex w-full text-sm text-slate-700">
            Start at:&nbsp;
            <span className="font-semibold">
              {" "}
              {drivers.get(route.vehicle)?.address}
            </span>
          </span>
        </li>
        {route.steps.map((step: Step, idx: number) => (
          <Fragment key={idx}>
            {step.id && step.id >= 0 && (
              <li key={`step-${step.id}`}>
                <span className="flex w-full text-sm font-medium capitalize">
                  {convertSecondsToTime(step.arrival)}
                </span>

                <span className="font-base flex w-full text-sm text-slate-700">
                  {step.type === "job"
                    ? "Delivery at:"
                    : `Break for ${convertMinutes(step?.service ?? 0)} mins `}
                  &nbsp;
                  <span className="font-semibold">
                    {step.type === "job"
                      ? locations.get(step?.id)?.address
                      : ""}
                  </span>
                </span>
              </li>
            )}
          </Fragment>
        ))}
        <li>
          <span className="flex w-full text-sm font-bold">{endTime}</span>

          <span className="font-base flex w-full text-sm text-slate-700">
            End back at:&nbsp;
            <span className="font-semibold">
              {drivers.get(route.vehicle)?.address}
            </span>
          </span>
        </li>
      </ul>
      <br />
    </div>
  );
};
export default OptimizationRouteCard;
