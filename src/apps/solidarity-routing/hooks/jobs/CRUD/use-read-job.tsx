import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";
import { api } from "~/utils/api";
import { useSolidarityState } from "../../optimized-data/use-solidarity-state";
import { useStopsStore } from "../use-stops-store";

export const useReadJob = () => {
  const { depotId, isUserAllowedToSaveToDepot, routeId } = useSolidarityState();

  const sessionStorageJobs = useStopsStore((state) => state);

  const getRouteJobs = api.routePlan.getJobBundles.useQuery(
    { routeId: routeId as string },
    { enabled: isUserAllowedToSaveToDepot && routeId !== undefined }
  );

  const getDepotClients = api.clients.getDepotClients.useQuery(
    { depotId },
    { enabled: isUserAllowedToSaveToDepot && !!depotId }
  );

  const routeJobs =
    (isUserAllowedToSaveToDepot
      ? getRouteJobs.data
      : sessionStorageJobs.locations) ?? [];

  const depotClients = getDepotClients.data ?? [];

  const checkIfJobExistsInStorage = (
    id: string | null
  ): ClientJobBundle | null => {
    return (
      sessionStorageJobs.locations?.find((bundle) => bundle.job.id === id) ??
      null
    );
  };

  const checkIfJobExistsInRoute = (
    id: string | null
  ): ClientJobBundle | null => {
    return routeJobs?.find((bundle) => bundle.job.id === id) ?? null;
  };

  const checkIfClientExistsInRoute = (
    id: string | null
  ): ClientJobBundle | null => {
    return routeJobs?.find((bundle) => bundle.client?.id === id) ?? null;
  };

  const getJobById = (
    jobId: string | null | undefined
  ): ClientJobBundle | null => {
    if (!jobId) return null;

    if (isUserAllowedToSaveToDepot) return checkIfJobExistsInRoute(jobId);
    else return checkIfJobExistsInStorage(jobId);
  };

  const getClientById = (
    clientId: string | null | undefined
  ): ClientJobBundle | null => {
    if (!clientId) return null;

    if (isUserAllowedToSaveToDepot) return checkIfClientExistsInRoute(clientId);
    else return checkIfJobExistsInStorage(clientId);
  };

  const isLoading = isUserAllowedToSaveToDepot ? getRouteJobs.isLoading : false;

  return {
    routeJobs,
    isLoading,
    depotClients,
    getJobById,
    getClientById,
    checkIfJobExistsInRoute,
    checkIfJobExistsInStorage,
  };
};
