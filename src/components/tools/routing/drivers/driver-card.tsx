import { ChevronRight } from "lucide-react";
import { useMemo, type FC } from "react";
import { useDriverSheet } from "~/hooks/routing/use-driver-sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";

import { parseDataFromDriver } from "~/utils/routing/data-formatting";

import { cn } from "~/utils/styles";
import type { Driver } from "../types";

type TDriverCard = {
  driver: Driver;
};

const DriverCard: FC<TDriverCard> = ({ driver }) => {
  const { onOpen } = useDriverSheet();
  const { setActiveDriver, activeDriver } = useDrivers((state) => state);
  const { name } = useMemo(() => parseDataFromDriver(driver), [driver]);

  const onEdit = () => {
    setActiveDriver(driver);
    onOpen();
  };

  const isActive = activeDriver?.id === driver.id;

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
      </span>
      <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
    </div>
  );
};

export default DriverCard;
