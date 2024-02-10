import { api } from "~/utils/api";
import { MapPoint } from "../../components/map/routing-map";
import { ClientJobBundle, OptimizedRoutePath } from "../../types.wip";
import { cuidToIndex } from "../../utils/generic/format-utils.wip";
import { useDriverVehicleBundles } from "../drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "../jobs/use-client-job-bundles";
import { useSolidarityState } from "./use-solidarity-state";

export const useOptimizedRoutePlan = () => {
  const { pathId, routeId } = useSolidarityState();

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

  const assigned = getOptimizedData.data?.stops
    ?.filter((job) => job.type === "job" && job.jobId !== null)
    .map((job) => jobBundles.getJobById(job?.jobId ?? "")) as ClientJobBundle[];

  const driverBundles = useDriverVehicleBundles();

  const currentDriver = driverBundles.getVehicleById(
    getOptimizedData.data?.vehicleId
  );

  const mapData = {
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

  return {
    data: getOptimizedData.data ?? null,
    routeDetails: getRoutePlan.data ?? null,
    isLoading: getOptimizedData.isLoading,
    error: null,
    unassigned: unassigned ?? [],
    assigned: assigned ?? [],
    routes: [],
    mapData,
  };
};
