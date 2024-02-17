"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import * as React from "react";
import type { SelectSingleEventHandler } from "react-day-picker";

import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";

import { useReadRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-read-route-plans";
import { cn } from "~/utils/styles";

interface IProps {
  date: Date | undefined;
  setDate: SelectSingleEventHandler;
}
export function JobDepotDateSelectBtn({ date, setDate }: IProps) {
  const [open, setOpen] = React.useState(false);

  const { currentRoute } = useReadRoutePlans();

  // Workaround for overlapping @radix-ui/react-dismissable-layers
  React.useEffect(() => {
    if (!open) {
      setTimeout(() => {
        document.body.style.pointerEvents = "";
      }, 500);
    }
  }, [open]);

  const checkIfDateIsValid = (date: Date) => {
    return (
      date > new Date() ||
      date < new Date("2024-01-01") ||
      date.getDate() === currentRoute?.deliveryAt.getDate()
    );
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          type="button"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="z-50 w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          disabled={checkIfDateIsValid}
        />
      </PopoverContent>
    </Popover>
  );
}
