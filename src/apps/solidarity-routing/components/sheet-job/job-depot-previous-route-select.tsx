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
import { useRoutePlans } from "../../hooks/plans/use-route-plans";

interface IProps {
  date: Date | undefined;
  setDate: SelectSingleEventHandler;
}
export function JobDepotPreviousRouteSelect({ date, setDate }: IProps) {
  const { allRoutes } = useRoutePlans();
  const [open, setOpen] = React.useState(false);
  const dateMap = allRoutes.map((route) => route.deliveryAt);

  const { currentRoute } = useReadRoutePlans();

  // Workaround for overlapping @radix-ui/react-dismissable-layers
  React.useEffect(() => {
    setTimeout(() => {
      document.body.style.pointerEvents = "";
    }, 500);
  }, []);

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
          className={cn(
            "w-full pl-3 text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          {date ? format(date, "PPP") : <span>Pick a date</span>}
          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
          disabled={checkIfDateIsValid}
          modifiers={{ route: dateMap ?? [] }}
          modifiersClassNames={{
            route:
              "text-sky-500 aria-selected:bg-sky-500 aria-selected:text-white",
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
