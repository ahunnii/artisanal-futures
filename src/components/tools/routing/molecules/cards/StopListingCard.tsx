import type { FC } from "react";
import type { Location, TimeWindow } from "~/types";
import { convertTime } from "~/utils/routing";
import EntryMenu from "../menus/EntryMenu";

interface IProps {
  stop: Location;
  onEdit: () => void;
  onView: () => void;
}

/**
 * Card component that displays a stop's information.
 * @param stop The stop to display.
 * @param onEdit Callback function to handle when the user clicks the edit button.
 */

const StopListingCard: FC<IProps> = ({ stop, onEdit, onView }) => {
  return (
    <div className="m-1 flex items-center justify-between p-3 text-left font-medium odd:bg-slate-300 even:bg-slate-100 ">
      <span className="w-10/12">
        <h2 className="font-bold text-slate-800">{stop.customer_name}</h2>
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
          {stop.time_windows.map((tw: TimeWindow, idx: number) => (
            <span key={idx}>
              {convertTime(tw.startTime)} - {convertTime(tw.endTime)}
              {idx !== stop.time_windows.length - 1 && <>&#44; </>}
            </span>
          ))}
        </p>
      </span>
      <EntryMenu editCallback={onEdit} viewCallback={onView} />
    </div>
  );
};

export default StopListingCard;
