import { Coffee, Home } from "lucide-react";

import {
  convertSecondsToComponents,
  convertSecondsToTime,
} from "~/utils/routing/time-formatting";
import { cn } from "~/utils/styles";
import type { ExtendedStepData } from "../types";

const StepLineSegment = ({
  step,
  idx,
  addressRoundTrip,
  color,
}: {
  step: ExtendedStepData;
  idx?: number;
  addressRoundTrip?: string;
  color?: string;
  handleOnClick?: (data: unknown) => void;
}) => {
  const time = step?.arrival ?? "00:00";

  const { name, address } = JSON.parse(step.description ?? "{}");

  const segmentType = {
    job: {
      firstLine: name + " - " + step?.status,
      secondLine: address,
      Icon: <>{idx}</>,
    },
    start: {
      firstLine: "Start from ",
      secondLine: addressRoundTrip,
      Icon: <Home className="p-1" />,
    },
    end: {
      firstLine: "End back at",
      secondLine: addressRoundTrip,
      Icon: <Home className="p-1" />,
    },
    break: {
      firstLine: "Break Time",
      secondLine: `Duration is ${
        convertSecondsToComponents(step?.service).formatted
      }`,
      Icon: <Coffee className="p-1" />,
    },
  };

  return (
    <div className="flex  w-full text-sm font-medium ">
      <div className="relative col-start-2 col-end-4 mr-10 md:mx-auto">
        <div className="flex h-full w-6 items-center justify-center">
          <div
            className={cn(
              "pointer-events-none h-full w-1 ",
              color ?? "bg-blue-400",
              step?.status === "success" && "bg-green-400",
              step?.status === "failed" && "bg-red-400"
            )}
          ></div>
        </div>
        <div
          className={cn(
            "absolute top-1/2 -mt-3 h-6 w-6 rounded-full text-center shadow",
            color ?? "bg-blue-400",
            step?.status === "success" && "bg-green-400",
            step?.status === "failed" && "bg-red-400"
          )}
        >
          <i className="fas fa-exclamation-circle text-xs text-white">
            {segmentType[step.type as keyof typeof segmentType].Icon}
          </i>
        </div>
      </div>
      <div className=" col-start-4 col-end-12 my-2 mr-auto flex w-full items-center justify-between  rounded-xl p-4 ">
        <div className="basis-2/3 flex-col text-left ">
          <h3
            className={cn(
              "mb-1 text-base font-semibold text-slate-500",
              step?.status === "success" && "text-green-400 line-through",
              step?.status === "failed" && "text-red-400 line-through"
            )}
          >
            {segmentType[step.type as keyof typeof segmentType].firstLine}
          </h3>
          <p
            className={cn(
              "w-full text-justify text-sm leading-tight text-slate-400",
              step?.status === "success" && "text-green-400 line-through",
              step?.status === "failed" && "text-red-400 line-through"
            )}
          >
            {segmentType[step.type as keyof typeof segmentType].secondLine}
          </p>
        </div>

        <div className="flex basis-1/3 items-center justify-end font-semibold text-slate-500">
          {convertSecondsToTime(time)}
        </div>
      </div>
    </div>
  );
};

export default StepLineSegment;
