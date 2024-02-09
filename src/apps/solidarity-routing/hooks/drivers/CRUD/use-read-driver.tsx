import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import { useParams, usePathname } from "next/navigation";

import toast from "react-hot-toast";
import { driverData } from "~/apps/solidarity-routing/data/drivers/driver-data";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

type TCreateNewDriversProps = {
  driver: DriverVehicleBundle;
};

type Coordinates = {
  lat: number;
  lng: number;
};

export const useReadDriver = () => {
  const { data: session, status } = useSession();
  const sessionStorageDrivers = useDriversStore((state) => state);

  const pathname = usePathname();

  const params = useParams();

  const apiContext = api.useContext();

  const depotId = Number(params?.depotId as string);
  const routeId = params?.routeId as string;

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = status === "authenticated" && !isSandbox;

  const getDepotDrivers = api.drivers.getDepotDrivers.useQuery(
    { depotId },
    { enabled: isUserAllowedToSaveToDepot }
  );

  // const getRouteVehicles = api.drivers.getRouteVehicles.useQuery(
  //   { routeId },
  //   { enabled: isUserAllowedToSaveToDepot }
  // );

  const getRouteVehicles = api.routePlan.getVehicleBundles.useQuery(
    {
      routeId,
    },
    { enabled: isUserAllowedToSaveToDepot && routeId !== undefined }
  );

  const depotDrivers = getDepotDrivers.data ?? [];

  const routeDrivers = isUserAllowedToSaveToDepot
    ? getRouteVehicles.data ?? []
    : sessionStorageDrivers.drivers;

  const getDriverById = (vehicleId: string | null | undefined) => {
    if (!vehicleId) return null;

    if (isUserAllowedToSaveToDepot) {
      return depotDrivers.find((driver) => driver.vehicle.id === vehicleId);
    } else {
      return sessionStorageDrivers.drivers?.find(
        (driver) => driver.vehicle.id === vehicleId
      );
    }
  };

  const getVehicleById = (
    vehicleId: string | null | undefined
  ): DriverVehicleBundle | null => {
    if (!vehicleId) return null;

    if (isUserAllowedToSaveToDepot) {
      return (
        routeDrivers.find((driver) => driver.vehicle.id === vehicleId) ?? null
      );
    } else {
      return (
        sessionStorageDrivers.drivers?.find(
          (driver) => driver.vehicle.id === vehicleId
        ) ?? null
      );
    }
  };

  const activeDriver = sessionStorageDrivers.activeDriver;

  // Get all depot drivers
  // Get all route vehicle bundles
  // Get active driver
  return {
    depotDrivers,
    routeDrivers,
    activeDriver,
    getDriverById,
    getVehicleById,
    drivers: isUserAllowedToSaveToDepot
      ? routeDrivers ?? sessionStorageDrivers.drivers ?? []
      : sessionStorageDrivers.drivers ?? [],
  };
};
