import { useMemo, type FC } from "react";
import type { Stop } from "../types";

import { useSheet } from "~/hooks/routing/use-sheet";
import { useStops } from "~/hooks/routing/use-stops";
import { parseDataFromStop } from "~/utils/routing/data-formatting";

import { ChevronRight } from "lucide-react";
import { cn } from "~/utils/styles";

interface IProps {
  stop: Stop;
}

const StopCard: FC<IProps> = ({ stop }) => {
  const { onOpen } = useSheet();
  const { setActiveLocation, activeLocation } = useStops((state) => state);
  const { name, address } = useMemo(() => parseDataFromStop(stop), [stop]);

  const onEdit = () => {
    setActiveLocation(stop);
    onOpen();
  };

  const isActive = activeLocation?.id === stop.id;

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between p-3 text-left font-medium shadow odd:bg-slate-300/50 even:bg-slate-100 hover:ring-1 hover:ring-slate-800/30",
        isActive && "odd:bg-indigo-300/50 even:bg-indigo-100"
      )}
    >
      <span className="group w-10/12 cursor-pointer" onClick={onEdit}>
        <h2
          className={cn(
            "text-sm font-bold capitalize ",
            isActive ? "text-indigo-800 " : "text-slate-800 "
          )}
        >
          {name}
        </h2>
        <h3
          className={cn(
            "text-xs font-medium text-slate-800/80",
            isActive && "text-indigo-800/80"
          )}
        >
          {address}
        </h3>
      </span>
      <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
    </div>
  );
};

export default StopCard;
