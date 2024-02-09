import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDriversStore } from "./use-drivers-store";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";

import type { DriverVehicleBundle } from "../../types.wip";
import { updateSearchParams } from "../../utils/generic/update-search-params";
import { useCreateDriver } from "./CRUD/use-create-driver";
import { useDeleteDriver } from "./CRUD/use-delete-driver";
import { useReadDriver } from "./CRUD/use-read-driver";
import { useUpdateDriver } from "./CRUD/use-update-driver";

export const useDriverVehicleBundles = () => {
  const { data: session } = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const readDriver = useReadDriver();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();

  const searchParams = useSearchParams();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const routeId = params?.routeId as string;
  const user = session?.user ?? null;
  const isSandbox = pathname?.includes("sandbox");
  const isUserAllowedToSaveToDepot = session?.user !== null && !isSandbox;

  const getRouteVehicles = api.routePlan.getVehicleBundles.useQuery(
    { routeId },
    { enabled: isUserAllowedToSaveToDepot && routeId !== undefined }
  );

  const checkIfSearchParamExistsInDrivers = (id: string | null) => {
    return sessionStorageDrivers.drivers?.some(
      (driver) => driver.driver.id === id
    );
  };

  const updateDriverSearchParam = (id: number | string | null) => {
    const updatedParams = updateSearchParams({
      id,
      searchParams,
      type: "driver",
    });

    void router.replace(`${pathname}?${updatedParams}`);
  };

  const setActiveDriver = (id: string | null) => {
    updateDriverSearchParam(id);

    if (user && !isSandbox) {
      // Check if the route has data
      if (getRouteVehicles.data) {
        // Find the driver in the route
        const depotDriver = (
          getRouteVehicles.data as unknown as DriverVehicleBundle[]
        )?.find((bundle: DriverVehicleBundle) => bundle.vehicle.id === id);

        // Assign the driver to the active driver or null if not found
        if (depotDriver) sessionStorageDrivers.setActiveDriver(depotDriver);
        else sessionStorageDrivers.setActiveDriver(null);
      }
    } else {
      // If the user is not authenticated, set the active driver from the zustand store
      if (sessionStorageDrivers.drivers)
        sessionStorageDrivers.setActiveDriverById(id);
      else sessionStorageDrivers.setActiveDriver(null);
    }
  };

  useEffect(() => {
    if (
      sessionStorageDrivers.drivers &&
      checkIfSearchParamExistsInDrivers(searchParams.get("driverId"))
    ) {
      setActiveDriver(searchParams.get("driverId"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    isDataLoading: user && !isSandbox ? getRouteVehicles.isLoading : false,

    data:
      user && !isSandbox
        ? (getRouteVehicles.data as unknown as DriverVehicleBundle[]) ??
          sessionStorageDrivers.drivers ??
          ([] as DriverVehicleBundle[])
        : sessionStorageDrivers.drivers ?? ([] as DriverVehicleBundle[]),
    active: sessionStorageDrivers.activeDriver,
    depot: readDriver.depotDrivers,
    route: readDriver.routeDrivers,
    getDriverById: readDriver.getDriverById,
    getVehicleById: readDriver.getVehicleById,

    create: createDriver.createNewDriver,
    createMany: createDriver.createNewDrivers,
    createByLatLng: createDriver.createNewDriverByLatLng,

    updateDefaults: updateDriver.updateDepotDriverDefaults,
    updateDepotDriver: updateDriver.updateDepotDriverDetails,
    updateDriver: updateDriver.updateRouteVehicle,

    deleteFromRoute: deleteDriver.deleteDriverFromRoute,
    deleteFromDepot: deleteDriver.deleteDriverFromDepot,

    isActive: (id: string) => {
      return sessionStorageDrivers.activeDriver?.vehicle.id === id;
    },

    edit: (id: string) => {
      setActiveDriver(id);
      sessionStorageDrivers.setIsDriverSheetOpen(true);
    },

    isSheetOpen: sessionStorageDrivers.isDriverSheetOpen,
    onSheetOpenChange: (state: boolean) => {
      if (!state) setActiveDriver(null);
      sessionStorageDrivers.setIsDriverSheetOpen(state);
    },

    assign: createDriver.setRouteDrivers,
    assignToDepot: createDriver.setDepotDrivers,
  };
};
