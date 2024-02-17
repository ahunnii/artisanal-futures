import { api } from "~/utils/api";
import { useSolidarityState } from "../optimized-data/use-solidarity-state";

export const useReadRoutePlans = () => {
  const { routeId } = useSolidarityState();
  const currentRoute = api.routePlan.getRoutePlanById.useQuery(
    { id: routeId as string },
    { enabled: !!routeId }
  );

  return {
    currentRoute: currentRoute.data,
  };
};
