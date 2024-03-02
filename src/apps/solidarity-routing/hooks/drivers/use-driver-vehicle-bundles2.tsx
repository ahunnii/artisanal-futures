import { useRoadsStore } from "../../stores/use-roads-store";

import { useUrlParams } from "~/hooks/use-url-params";

import { useSolidarityState } from "../optimized-data/use-solidarity-state";

import { useCreateRoads } from "./CRUD/use-create-driver2"; // de-structuring

// Shoud use road specific versions
//
// WITH THESE WE CAN UNCOMMENT THE REST OF THE FILE
//
// import { useDeleteDriver } from "./CRUD/use-delete-driver";
// import { useReadDriver } from "./CRUD/use-read-driver";
// import { useUpdateDriver } from "./CRUD/use-update-driver";

export const useDriverVehicleBundles2 = () => {
  const { updateUrlParams } = useUrlParams();
  const { isUserAllowedToSaveToDepot } = useSolidarityState();

  //const readDriver = useReadDriver();

  const createRoads = useCreateRoads();

  //const updateDriver = useUpdateDriver();
  //const deleteDriver = useDeleteDriver();

  const sessionStorageRoads = useRoadsStore((state) => state);

  const setActiveDriver = (id: string | null) => {
    updateUrlParams({
      key: "driverId",
      value: id,
    });

    // const driver = isUserAllowedToSaveToDepot
    //   ? readDriver.checkIfDriverExistsInRoute(id)
    //   : readDriver.checkIfDriverExistsInStorage(id);

    // if (!driver) {
    //   sessionStorageDrivers.setActiveDriverById(null);
    //   return;
    // }

    // if (!isUserAllowedToSaveToDepot)
    //   sessionStorageDrivers.setActiveDriverById(id);
    // else sessionStorageDrivers.setActiveDriver(driver);
  };

  // useEffect(() => {
  //   const driverId = getUrlParam("driverId");
  //   if (driverId) setActiveDriver(driverId);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);
  return {
    // data: readDriver.routeDrivers,
    // isDataLoading: readDriver.isLoading,

    active: sessionStorageRoads.activeRoad,
    setActive: setActiveDriver,
    isActive: (id: string) => {
      return sessionStorageRoads.activeRoad?.id === id;
    },

    //depot: readDriver.depotDrivers,

    //getVehicleById: readDriver.getVehicleById,

    create: createRoads.createNewRoad,
    createMany: createRoads.createNewRoads,
    createByLatLng: createRoads.createNewRoadByLatLng,

    // updateDefaults: updateDriver.updateDepotDriverDefaults,
    // updateDepotDriver: updateDriver.updateDepotDriverDetails,
    // updateDriver: updateDriver.updateRouteVehicle,

    // deleteFromRoute: deleteDriver.deleteDriverFromRoute,
    // deleteFromDepot: deleteDriver.deleteDriverFromDepot,

    // deleteAllDrivers: deleteDriver.purgeAllDrivers,
    // deleteAllVehicles: deleteDriver.purgeAllVehicles,
    // deleteAll: deleteDriver.purgeAllDriverVehicleBundles,

    edit: (id: string) => {
      setActiveDriver(id);
      sessionStorageRoads.setIsRoadSheetOpen(true);
    },

    isSheetOpen: sessionStorageRoads.isRoadSheetOpen,
    onSheetOpenChange: (state: boolean) => {
      if (!state) setActiveDriver(null);
      sessionStorageRoads.setIsRoadSheetOpen(state);
    },

    assign: createRoads.setDepotRoads,

    isMessageSheetOpen: sessionStorageRoads.isRoadMessagePanelOpen,
    onMessageSheetOpenChange: (state: boolean) => {
      if (!state) setActiveDriver(null);
      sessionStorageRoads.setIsRoadMessagePanelOpen(state);
    },

    message: (id: string) => {
      setActiveDriver(id);
      sessionStorageRoads.setIsRoadMessagePanelOpen(true);
    },

    isRouteSheetOpen: sessionStorageRoads.isRoadRoutePanelOpen,
    onRouteSheetOpenChange: (state: boolean) => {
      if (!state) setActiveDriver(null);
      if (!state)
        updateUrlParams({
          key: "optimizedId",
          value: null,
        });

        sessionStorageRoads.setIsRoadRoutePanelOpen(state);
    },

    route: (id: string, routeId: string) => {
      setActiveDriver(id);
      updateUrlParams({
        key: "optimizedId",
        value: routeId,
      });

      sessionStorageRoads.setIsRoadRoutePanelOpen(true);
    },
  };
};
