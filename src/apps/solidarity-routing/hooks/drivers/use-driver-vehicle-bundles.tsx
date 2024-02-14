import { useEffect } from "react";

import { useDriversStore } from "./use-drivers-store";

import { useUrlParams } from "~/hooks/use-url-params";

import { useSolidarityState } from "../optimized-data/use-solidarity-state";
import { useCreateDriver } from "./CRUD/use-create-driver";
import { useDeleteDriver } from "./CRUD/use-delete-driver";
import { useReadDriver } from "./CRUD/use-read-driver";
import { useUpdateDriver } from "./CRUD/use-update-driver";

export const useDriverVehicleBundles = () => {
  const { updateUrlParams, getUrlParam } = useUrlParams();
  const { isUserAllowedToSaveToDepot } = useSolidarityState();

  const readDriver = useReadDriver();
  const createDriver = useCreateDriver();
  const updateDriver = useUpdateDriver();
  const deleteDriver = useDeleteDriver();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const setActiveDriver = (id: string | null) => {
    updateUrlParams({
      key: "driverId",
      value: id,
    });

    const driver = isUserAllowedToSaveToDepot
      ? readDriver.checkIfDriverExistsInDepot(id)
      : readDriver.checkIfDriverExistsInStorage(id);

    if (!driver) {
      sessionStorageDrivers.setActiveDriverById(null);
      return;
    }

    if (!isUserAllowedToSaveToDepot)
      sessionStorageDrivers.setActiveDriverById(id);
    else sessionStorageDrivers.setActiveDriver(driver);
  };

  useEffect(() => {
    const driverId = getUrlParam("driverId");
    if (driverId) setActiveDriver(driverId);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data: readDriver.routeDrivers,
    isDataLoading: readDriver.isLoading,

    active: sessionStorageDrivers.activeDriver,
    isActive: (id: string) => {
      return sessionStorageDrivers.activeDriver?.vehicle.id === id;
    },

    depot: readDriver.depotDrivers,

    getVehicleById: readDriver.getVehicleById,

    create: createDriver.createNewDriver,
    createMany: createDriver.createNewDrivers,
    createByLatLng: createDriver.createNewDriverByLatLng,

    updateDefaults: updateDriver.updateDepotDriverDefaults,
    updateDepotDriver: updateDriver.updateDepotDriverDetails,
    updateDriver: updateDriver.updateRouteVehicle,

    deleteFromRoute: deleteDriver.deleteDriverFromRoute,
    deleteFromDepot: deleteDriver.deleteDriverFromDepot,

    deleteAllDrivers: deleteDriver.purgeAllDrivers,
    deleteAllVehicles: deleteDriver.purgeAllVehicles,
    deleteAll: deleteDriver.purgeAllDriverVehicleBundles,

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
  };
};
