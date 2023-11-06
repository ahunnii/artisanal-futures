import { ChevronRight } from "lucide-react";
import { useMemo, type FC } from "react";
import { useDriverSheet } from "~/hooks/routing/use-driver-sheet";
import { useDrivers } from "~/hooks/routing/use-drivers";

import { parseDataFromDriver } from "~/utils/routing/data-formatting";

import { cn } from "~/utils/styles";
import type { Driver } from "../types";

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
  driver: Driver;
}

/**
 * Card component that displays a driver's information.
 * @param driver The driver to display.
 * @param onEdit Callback function to handle when the user clicks the edit button.
 */

const DriverMinimalCard: FC<IProps> = ({ driver, className }) => {
  const { onOpen, setIsViewOnly } = useDriverSheet();
  const { setActiveDriver, activeDriver } = useDrivers((state) => state);

  const onEdit = () => {
    setActiveDriver(driver);
    onOpen();
    setIsViewOnly(false);
  };

  const setCurrentDriver = () => onEdit();

  const { name } = useMemo(() => parseDataFromDriver(driver), [driver]);

  return (
    <div
      className={cn(
        "flex w-full items-center justify-between p-3 text-left font-medium shadow odd:bg-slate-300/50 even:bg-slate-100 hover:ring-1 hover:ring-slate-800/30",
        activeDriver?.id === driver.id &&
          "odd:bg-indigo-300/50 even:bg-indigo-100",
        className
      )}
    >
      <span className="group w-10/12 cursor-pointer" onClick={setCurrentDriver}>
        <h2
          className={cn(
            "text-sm font-bold capitalize ",
            activeDriver?.id === driver.id
              ? "text-indigo-800 "
              : "text-slate-800 "
          )}
        >
          {name}
        </h2>
      </span>
      <ChevronRight className="text-slate-800 group-hover:bg-opacity-30" />
    </div>
  );
};

export default DriverMinimalCard;
