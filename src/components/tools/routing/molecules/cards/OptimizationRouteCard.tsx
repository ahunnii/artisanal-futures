import {
  convertMinutes,
  convertSecondsToTime,
  formatTime,
  getColor,
} from "~/utils/routing";

import { useCallback, type FC } from "react";

import { Disclosure } from "@headlessui/react";

import { Fragment } from "react";

import { ChevronUp } from "lucide-react";

import RouteQRModal from "~/components/tools/routing/molecules/RouteQRModal";
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

  const extractRouteInfo = useCallback(() => {
    const vehicles: VehicleInfo = {
      vehicle: route.vehicle,
      description: route.description,
      steps: route.steps.map((step: Step) => ({
        type: step.type,
        id: step.id,
        job: step.job ?? null,
        location: step.location,
        arrival: step.arrival,
        duration: step.duration,
      })),
      geometry: route.geometry,
    };
    return vehicles;
  }, [route]);

  const startTime = formatTime(route.steps[0]?.arrival ?? 0);
  const endTime = formatTime(route.steps[route.steps.length - 1]?.arrival ?? 0);

  return (
    <div
      className={
        " flex  flex-col bg-slate-50 p-2  " +
        " shadow " +
        color.shadow +
        " border-2 " +
        color.border
      }
    >
      <Disclosure>
        {({ open }) => (
          <>
            <Disclosure.Button className="flex items-center justify-between ">
              <p className=" flex flex-col text-left font-bold text-slate-800">
                <span>{drivers.get(route.vehicle)?.name}</span>
                <span>
                  {startTime} to {endTime}
                </span>
              </p>
              <span className="flex items-center gap-4">
                <RouteQRModal data={extractRouteInfo()} />{" "}
                <ChevronUp
                  className={
                    `${open ? "rotate-180 transform" : ""} h-5 w-5 ` +
                    color.text
                  }
                />
              </span>
            </Disclosure.Button>

            <Disclosure.Panel>
              <ul
                role="list"
                className="list-disc space-y-3 py-3 pl-5 text-slate-500 marker:text-sky-400"
              >
                <li>
                  <span className="flex w-full text-sm font-bold">
                    {startTime}
                  </span>
                  <span className="font-base flex w-full text-sm text-slate-700">
                    Leave from:
                  </span>
                  <span className="flex w-full text-sm font-semibold text-slate-500">
                    {drivers.get(route.vehicle)?.address}
                  </span>
                </li>
                {route.steps.map((step: Step, idx: number) => (
                  <Fragment key={idx}>
                    {step.id && step.id >= 0 && (
                      <li key={`step-${step.id}`}>
                        <span className="flex w-full text-sm  font-bold capitalize">
                          {convertSecondsToTime(step.arrival)}
                        </span>

                        <span className="font-base flex w-full text-sm text-slate-700">
                          {step.type === "job"
                            ? "Delivery at:"
                            : `Break for ${convertMinutes(
                                step?.service ?? 0
                              )} mins `}
                        </span>
                        <span className="flex w-full text-sm font-semibold text-slate-500">
                          {step.type === "job"
                            ? locations.get(step?.id)?.address
                            : ""}
                        </span>
                      </li>
                    )}
                  </Fragment>
                ))}
                <li>
                  <span className="flex w-full text-sm font-bold">
                    {endTime}
                  </span>

                  <span className="font-base flex w-full text-sm text-slate-700">
                    End back at:
                  </span>
                  <span className=" flex w-full text-sm font-semibold text-slate-500">
                    {drivers.get(route.vehicle)?.address}
                  </span>
                </li>
              </ul>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};
export default OptimizationRouteCard;
