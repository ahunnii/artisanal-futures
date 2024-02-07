import type { SelectSingleEventHandler } from "react-day-picker";
import { Calendar } from "~/components/ui/calendar";

export const RouteCalendar = ({
  date,
  setDate,
}: {
  date: Date;
  setDate: SelectSingleEventHandler;
}) => {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
};
