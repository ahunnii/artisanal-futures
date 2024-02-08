import { useRouter } from "next/router";
import { useState } from "react";
import type {
  DayClickEventHandler,
  Matcher,
  SelectSingleEventHandler,
} from "react-day-picker";
import { buttonVariants } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

export const RouteCalendar = ({
  date,
  setDate,
}: {
  date: Date | undefined;
  setDate: SelectSingleEventHandler;
}) => {
  const router = useRouter();
  const { depotId } = router.query;
  const routes = api.routePlan.getAllRoutes.useQuery(
    {
      depotId: Number(depotId),
    },
    {
      enabled: !!depotId,
    }
  );

  const dateMap = routes?.data?.map((route) => route.deliveryAt);

  return (
    <Calendar
      mode="single"
      selected={date}
      onSelect={setDate}
      className="rounded-md border"
      modifiers={{ route: dateMap ?? [] }}
      modifiersClassNames={{
        route: "text-sky-500 aria-selected:bg-sky-500 aria-selected:text-white",
      }}
    />
  );
};
