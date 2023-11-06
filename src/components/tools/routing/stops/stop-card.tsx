import type { FC } from "react";
import type { Stop, TimeWindow } from "../types";

import { useSheet } from "~/hooks/routing/use-sheet";
import { useStops } from "~/hooks/routing/use-stops";
// import { convertTime } from "~/utils/routing";
import EntryMenu from "../ui/EntryMenu";

interface IProps {
  stop: Stop;
}

/**
 * Card component that displays a stop's information.
 * @param stop The stop to display.
 * @param onEdit Callback function to handle when the user clicks the edit button.
 */

const StopCard: FC<IProps> = ({ stop }) => {
  const { onOpen, setIsViewOnly } = useSheet();
  const { setActiveLocation, locations, setLocations } = useStops(
    (state) => state
  );

  const onEdit = () => {
    setActiveLocation(stop);
    onOpen();
    setIsViewOnly(false);
  };
  const onView = () => {
    setActiveLocation(stop);
    onOpen();
    setIsViewOnly(true);
  };

  const onDelete = () => {
    const temp = locations.filter((loc) => loc.id !== stop.id);
    setLocations(temp);
  };
  return (
    <div className=" flex w-full items-center justify-between p-3 text-left font-medium odd:bg-slate-300 even:bg-slate-100">
      <span className="w-10/12">
        <h2 className="font-bold capitalize text-slate-800">
          {stop.customer_name}
        </h2>
        <h3 className="text-sm font-medium text-slate-800/80">
          {stop.address}
        </h3>
        <div className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
          <p>
            <span className="font-semibold">{stop.drop_off_duration}</span> min
          </p>
          <span>&middot;</span>
          <p>{stop.priority > 50 ? "High" : "Normal"} priority</p>
        </div>
        <p className="mt-2 text-xs text-slate-700">
          {stop?.time_windows?.map((tw: TimeWindow, idx: number) => (
            <span key={idx}>
              {tw.startTime} - {tw.endTime}
              {idx !== stop.time_windows.length - 1 && <>&#44; </>}
            </span>
          ))}
        </p>
      </span>
      <EntryMenu
        editCallback={onEdit}
        viewCallback={onView}
        deleteCallback={onDelete}
      />
    </div>
  );
};

export default StopCard;
