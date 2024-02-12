import { useMemo } from "react";
import { api } from "~/utils/api";
import type { MapPoint } from "../../components/map/routing-map";
import type { ClientJobBundle, OptimizedStop } from "../../types.wip";
import { cuidToIndex } from "../../utils/generic/format-utils.wip";
import { useDriverVehicleBundles } from "../drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "../jobs/use-client-job-bundles";
import { useSolidarityState } from "./use-solidarity-state";

type OptimizedRoutePathMapData = {
  driver: MapPoint[];
  jobs: MapPoint[];
  geometry: {
    id: string;
    geoJson: string;
    vehicleId: string;
  }[];
};

type Bundle = {
  bundle: ClientJobBundle;
  optimized: OptimizedStop | null;
};
type Destination = Map<string, Bundle[]>;

export const useOptimizedRoutePlan = () => {
  const { pathId, routeId } = useSolidarityState();
  const apiContext = api.useContext();

  const updateRoutePathStatus =
    api.routePlan.updateOptimizedRoutePathStatus.useMutation({
      onSettled: () => {
        void apiContext.routePlan.invalidate();
      },
    });

  const getOptimizedData = api.routePlan.getOptimizedData.useQuery(
    { pathId: pathId as string },
    { enabled: pathId !== undefined }
  );

  const getRoutePlan = api.routePlan.getRoutePlanById.useQuery(
    { id: routeId as string },
    { enabled: routeId !== undefined }
  );

  const unassigned = getRoutePlan.data?.jobs?.filter((job) => !job.isOptimized);

  const jobBundles = useClientJobBundles();

  const stopsThatAreJobs: OptimizedStop[] = (
    getOptimizedData.data?.stops as OptimizedStop[]
  )?.filter((job) => job.type === "job" && job.jobId !== null);

  const assigned = getOptimizedData.data?.stops
    ?.filter((job) => job.type === "job" && job.jobId !== null)
    .map((job) => jobBundles.getJobById(job?.jobId ?? "")) as ClientJobBundle[];

  const driverBundles = useDriverVehicleBundles();

  const currentDriver = driverBundles.getVehicleById(
    getOptimizedData.data?.vehicleId
  );

  const routeDestinations: Destination = useMemo(() => {
    const destinations = new Map<string, Bundle[]>();

    if (stopsThatAreJobs === undefined) return destinations;

    assigned?.forEach((bundle) => {
      const key = `${bundle.job.address.formatted}`;
      const stop = stopsThatAreJobs?.find(
        (stop) => stop.jobId === bundle.job.id
      );

      if (destinations.has(key)) {
        const existing = destinations.get(key);
        existing!.push({ bundle, optimized: stop ?? null });
        destinations.set(key, existing!);
      } else {
        destinations.set(key, [{ bundle, optimized: stop ?? null }]);
      }
    });

    return destinations;
  }, [assigned, stopsThatAreJobs]);

  const mapData: OptimizedRoutePathMapData = useMemo(() => {
    if (!getOptimizedData.data)
      return {
        driver: [],
        jobs: [],
        geometry: [],
      };

    return {
      driver: [
        {
          id: currentDriver?.vehicle.id,
          name: currentDriver?.driver.name,
          type: "vehicle",
          lat: currentDriver?.vehicle.startAddress.latitude,
          lng: currentDriver?.vehicle.startAddress.longitude,
          address: currentDriver?.vehicle.startAddress.formatted,
          color: cuidToIndex(currentDriver?.vehicle.id ?? ""),
        },
      ] as unknown as MapPoint[],
      jobs:
        assigned && assigned.length > 0
          ? (assigned.map((bundle) => {
              return {
                id: bundle?.job.id,
                type: "job",
                lat: bundle?.job?.address?.latitude,
                lng: bundle?.job?.address?.longitude,
                address: bundle?.job?.address?.formatted,
                color: cuidToIndex(currentDriver?.vehicle.id ?? ""),
              };
            }) as unknown as MapPoint[])
          : ([] as MapPoint[]),
      geometry: [
        {
          id: getOptimizedData?.data?.id,
          geoJson: getOptimizedData?.data?.geoJson,
          vehicleId: getOptimizedData?.data?.vehicleId,
        },
      ],
    };
  }, [assigned, currentDriver, getOptimizedData.data]);

  return {
    data: getOptimizedData.data ?? null,
    routeDetails: getRoutePlan.data ?? null,
    isLoading: getOptimizedData.isLoading,
    error: null,
    unassigned: unassigned ?? [],
    assigned: assigned ?? [],
    routes: [],
    mapData,

    destinations: routeDestinations,
    updateRoutePathStatus: updateRoutePathStatus.mutate,
  };
};
