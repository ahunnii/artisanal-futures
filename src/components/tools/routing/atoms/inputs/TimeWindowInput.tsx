import React, { useState, type FormEvent } from "react";
import type { TimeWindow } from "~/types";

// Interface for the time window data

interface TimeWindowProps {
  onAddTimeWindow: (timeWindow: TimeWindow, service?: number) => void;
  enableService?: boolean;
}

const TimeWindowInput: React.FC<TimeWindowProps> = ({
  onAddTimeWindow,
  enableService = false,
}) => {
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [service, setService] = useState("");

  const handleAddTimeWindow = (e: FormEvent) => {
    e.preventDefault();

    if (startTime && endTime) {
      const timeWindow: TimeWindow = { startTime, endTime };
      onAddTimeWindow(timeWindow, enableService ? Number(service) : undefined);
      setStartTime("");
      setEndTime("");
      setService("");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex flex-row items-center gap-4">
        <label>
          <span className="sr-only">Start Time</span>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
          />
        </label>
        <span> to </span>
        <label htmlFor="">
          <span className="sr-only">End Time</span>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
          />
        </label>

        {enableService && (
          <label>
            <span className="sr-only">Service</span>
            <input
              min="0"
              type="number"
              value={service}
              onChange={(e) => setService(e.target.value)}
              className="h-12  w-full items-center space-x-3 rounded-lg bg-slate-100 px-4 text-left text-slate-800 shadow-sm ring-slate-900/10 placeholder:text-slate-400 hover:ring-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 sm:flex "
            />
          </label>
        )}
      </div>
      <button
        onClick={handleAddTimeWindow}
        className="rounded bg-indigo-500 px-2 py-1 text-base font-bold text-white hover:bg-indigo-400"
      >
        Add {enableService ? "Break Slot" : "Time Window"}
      </button>
    </div>
  );
};

export default TimeWindowInput;
