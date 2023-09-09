import type { FC } from "react";
import type { Driver } from "~/types";
import { convertTime } from "~/utils/routing";
import EntryMenu from "../menus/EntryMenu";

interface IProps {
  driver: Driver;
  onEdit: () => void;
  onView: () => void;
}

/**
 * Card component that displays a driver's information.
 * @param driver The driver to display.
 * @param onEdit Callback function to handle when the user clicks the edit button.
 */

const DriverListingCard: FC<IProps> = ({ driver, onEdit, onView }) => {
  return (
    <div className="m-1 flex items-center justify-between p-3 text-left font-medium odd:bg-slate-300 even:bg-slate-100 ">
      <span className="w-10/12">
        <h2 className="font-bold text-slate-800">{driver.name}</h2>
        <h3 className="text-sm font-medium text-slate-800/80">
          {driver.address}
        </h3>
        <div className="mt-1 flex space-x-1 text-xs font-normal leading-4 text-gray-500">
          <p>{driver.break_slots.length} break(s)</p>
          <span>&middot;</span>
          <p>{driver.max_travel_time} min max travel</p>
          <span>&middot;</span>
          <p>{driver.max_stops} stops max</p>
        </div>{" "}
        <p className="font-lg mt-1 flex space-x-1 text-xs leading-4 text-gray-500">
          Shift from {convertTime(driver.time_window.startTime)} -{" "}
          {convertTime(driver.time_window.endTime)}
        </p>
      </span>
      <EntryMenu editCallback={onEdit} viewCallback={onView} />
    </div>
  );
};

export default DriverListingCard;
