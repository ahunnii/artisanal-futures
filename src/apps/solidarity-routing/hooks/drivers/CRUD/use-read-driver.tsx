import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useDriversStore } from "~/apps/solidarity-routing/stores/use-drivers-store";

import { api } from "~/utils/api";

import { useMemo } from "react";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

type BundleId = string | null | undefined;

type BundleResult = DriverVehicleBundle | null;
export const useReadDriver = () => {
  const { depotId, isUserAllowedToSaveToDepot, routeId, depotMode } =
    useSolidarityState();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const getDepotDrivers = api.drivers.getDepotDrivers.useQuery(
    { depotId },
    {
      enabled:
        isUserAllowedToSaveToDepot && !!depotId && depotMode !== "calculate",
    }
  );

  const getRouteVehicles = api.routePlan.getVehicleBundles.useQuery(
    { routeId: routeId },
    { enabled: isUserAllowedToSaveToDepot && !!routeId }
  );

  const depotDrivers = useMemo(
    () => getDepotDrivers.data ?? [],
    [getDepotDrivers.data]
  );

  const routeDrivers =
    (isUserAllowedToSaveToDepot
      ? getRouteVehicles.data
      : sessionStorageDrivers.drivers) ?? [];

  const checkIfDriverExistsInStorage = (id: BundleId): BundleResult => {
    return (
      sessionStorageDrivers.drivers?.find(
        (driver) => driver.vehicle.id === id
      ) ?? null
    );
  };

  const checkIfDriverExistsInRoute = (id: BundleId): BundleResult => {
    return routeDrivers?.find((bundle) => bundle.vehicle.id === id) ?? null;
  };

  const checkIfDriverExistsInDepot = (id: BundleId): BundleResult => {
    return depotDrivers?.find((bundle) => bundle.vehicle.id === id) ?? null;
  };

  const getDriverById = (vehicleId: BundleId): BundleResult => {
    if (!vehicleId) return null;

    if (isUserAllowedToSaveToDepot)
      return checkIfDriverExistsInDepot(vehicleId);

    return checkIfDriverExistsInStorage(vehicleId);
  };

  const getVehicleById = (vehicleId: BundleId): BundleResult => {
    if (!vehicleId) return null;

    if (isUserAllowedToSaveToDepot)
      return checkIfDriverExistsInRoute(vehicleId);

    return checkIfDriverExistsInStorage(vehicleId);
  };

  const activeDriver = sessionStorageDrivers.activeDriver;

  const isLoading = isUserAllowedToSaveToDepot
    ? getRouteVehicles.isLoading
    : false;

  return {
    isLoading,
    depotDrivers,
    routeDrivers,
    activeDriver,
    getDriverById,
    getVehicleById,
    checkIfDriverExistsInDepot,
    checkIfDriverExistsInStorage,
    checkIfDriverExistsInRoute,
    drivers: isUserAllowedToSaveToDepot
      ? routeDrivers ?? sessionStorageDrivers.drivers ?? []
      : sessionStorageDrivers.drivers ?? [],
  };
};
