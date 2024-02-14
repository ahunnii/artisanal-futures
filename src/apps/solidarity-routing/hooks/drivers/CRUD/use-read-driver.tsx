import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { useSolidarityState } from "../../optimized-data/use-solidarity-state";

export const useReadDriver = () => {
  const { depotId, isUserAllowedToSaveToDepot, routeId } = useSolidarityState();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const getDepotDrivers = api.drivers.getDepotDrivers.useQuery(
    { depotId },
    { enabled: isUserAllowedToSaveToDepot }
  );

  const getRouteVehicles = api.routePlan.getVehicleBundles.useQuery(
    { routeId: routeId as string },
    { enabled: isUserAllowedToSaveToDepot && routeId !== undefined }
  );

  const depotDrivers = getDepotDrivers.data ?? [];

  const routeDrivers =
    (isUserAllowedToSaveToDepot
      ? getRouteVehicles.data
      : sessionStorageDrivers.drivers) ?? [];

  const checkIfDriverExistsInStorage = (
    id: string | null
  ): DriverVehicleBundle | null => {
    return (
      sessionStorageDrivers.drivers?.find(
        (driver) => driver.vehicle.id === id
      ) ?? null
    );
  };

  const checkIfDriverExistsInRoute = (
    id: string | null
  ): DriverVehicleBundle | null => {
    return (
      routeDrivers?.find(
        (bundle: DriverVehicleBundle) => bundle.vehicle.id === id
      ) ?? null
    );
  };

  const checkIfDriverExistsInDepot = (
    id: string | null
  ): DriverVehicleBundle | null => {
    return (
      depotDrivers?.find(
        (bundle: DriverVehicleBundle) => bundle.vehicle.id === id
      ) ?? null
    );
  };

  const getDriverById = (
    vehicleId: string | null | undefined
  ): DriverVehicleBundle | null => {
    if (!vehicleId) return null;

    if (isUserAllowedToSaveToDepot)
      return checkIfDriverExistsInDepot(vehicleId);
    else return checkIfDriverExistsInStorage(vehicleId);
  };

  const getVehicleById = (
    vehicleId: string | null | undefined
  ): DriverVehicleBundle | null => {
    if (!vehicleId) return null;

    if (isUserAllowedToSaveToDepot)
      return checkIfDriverExistsInRoute(vehicleId);
    else return checkIfDriverExistsInStorage(vehicleId);
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
