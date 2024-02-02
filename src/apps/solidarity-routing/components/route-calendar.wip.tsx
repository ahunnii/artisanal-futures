import { useState } from "react";
import { Calendar } from "~/components/ui/calendar";

export const RouteCalendar = ({ date, setDate }) => {
  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
    />
  );
};
