import { Coffee, Home } from "lucide-react";

import { cn } from "~/utils/styles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import type { OptimizedStop } from "../../types.wip";
import { unixSecondsToStandardTime } from "../../utils/generic/format-utils.wip";

const StepLineSegment = ({
  step,
  idx,
  color,
  shiftStartAddress,
  shiftEndAddress,
}: {
  step: OptimizedStop;
  idx?: number;
  color?: string;
  shiftStartAddress?: string;
  shiftEndAddress?: string;
  handleOnClick?: (data: unknown) => void;
}) => {
  const time = step?.arrival ?? "00:00";

  const jobBundles = useClientJobBundles();
  const job = jobBundles.getJobById(step?.jobId) ?? null;

  const segmentType = {
    job: {
      firstLine: (job?.client?.name ?? job?.job.type) + " - " + step?.status,
      secondLine: job?.job?.address?.formatted ?? "",
      Icon: <>{idx}</>,
    },
    start: {
      firstLine: "Shift starts from ",
      secondLine: shiftStartAddress,
      Icon: <Home className="p-1" />,
    },
    end: {
      firstLine: "Shift ends back at",
      secondLine: shiftEndAddress,
      Icon: <Home className="p-1" />,
    },
    break: {
      firstLine: "Break Slot",
      secondLine: `Recommended to take their break`,
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
              step?.status === "COMPLETED" && "bg-green-400",
              step?.status === "FAILED" && "bg-red-400"
            )}
          ></div>
        </div>
        <div
          className={cn(
            "absolute top-1/2 -mt-3 h-6 w-6 rounded-full text-center shadow",
            color ?? "bg-blue-400",
            step?.status === "COMPLETED" && "bg-green-400",
            step?.status === "FAILED" && "bg-red-400"
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
              "mb-1 text-base font-semibold  capitalize  text-slate-500",
              step?.status === "COMPLETED" && "text-green-400 line-through",
              step?.status === "FAILED" && "text-red-400 line-through"
            )}
          >
            {segmentType[step.type as keyof typeof segmentType].firstLine}
          </h3>
          <p
            className={cn(
              "w-full text-justify text-sm capitalize leading-tight text-slate-400",
              step?.status === "COMPLETED" && "text-green-400 line-through",
              step?.status === "FAILED" && "text-red-400 line-through"
            )}
          >
            {segmentType[step.type as keyof typeof segmentType].secondLine}
          </p>
        </div>

        <div className="flex basis-1/3 items-center justify-end font-semibold text-slate-500">
          {unixSecondsToStandardTime(time)}
        </div>
      </div>
    </div>
  );
};

export default StepLineSegment;
