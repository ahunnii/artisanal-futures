import { notificationService } from "~/services/notification";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";

import { useDriversStore } from "~/apps/solidarity-routing/stores/use-drivers-store";

import { api } from "~/utils/api";

import { driverVehicleDataForNewLatLng } from "~/apps/solidarity-routing/data/driver-data";

import type {
  Coordinates,
  DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { useSolidarityMessaging } from "../../use-solidarity-messaging";

type TCreateNewDriverProps = { driver: DriverVehicleBundle };

type DriverVehicleBundles = { drivers: DriverVehicleBundle[] };

type TCreateNewDriversProps = {
  addToRoute?: boolean;
} & DriverVehicleBundles;

export const useCreateDriver2 = () => {
  const sessionStorageDrivers = useDriversStore((state) => state);

  const { isUserAllowedToSaveToDepot, depotId, routeId } = useSolidarityState();

  // const [newDriverIds, setNewDriverIds] = useState<string[]>([]);
  const { createDriverChannels } = useSolidarityMessaging();

  const apiContext = api.useContext();

  const invalidateData = () => {
    void apiContext.drivers.invalidate();
    void apiContext.routePlan.invalidate();
  };

  const createVehicleBundles = api.drivers.createVehicleBundles.useMutation({
    onSuccess: (data: DriverVehicleBundle[]) => {
      notificationService.notifySuccess({
        message: "Driver(s) successfully created.",
      });

      const driverIds = data.map(
        (driver: DriverVehicleBundle) => driver.driver.id
      );

      // if (driverIds) {
      createDriverChannels.mutate({
        depotId: depotId,
        bundles: driverIds,
      });
      // }
    },

    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "There was an issue creating the driver(s). Please try again.",
        error,
      }),
    onSettled: invalidateData,
  });

  const overrideCurrentDepot = api.drivers.setDepotVehicles.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Depot drivers were successfully set.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "There was an issue setting the driver(s). Please try again.",
        error,
      }),
    onSettled: invalidateData,
  });

  const overrideCurrentRoutes = api.routePlan.setRouteVehicles.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Route drivers were successfully set.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "There was an issue setting the driver(s). Please try again.",
        error,
      }),
    onSettled: () => {
      invalidateData();

      sessionStorageDrivers.setIsDriverSheetOpen(false);
      sessionStorageDrivers.setActiveDriver(null);
    },
  });

  const createNewDriver2 = ({ driver }: TCreateNewDriverProps) => {
    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.appendDriver(driver);
      return;
    }

    createVehicleBundles.mutate({
      data: [driver],
      depotId: depotId,
      routeId: routeId,
    });
  };

  const createNewDrivers = ({
    drivers,
    addToRoute,
  }: TCreateNewDriversProps) => {
    if (!isUserAllowedToSaveToDepot) {
      drivers.forEach((driver) => {
        sessionStorageDrivers.appendDriver(driver);
      });

      return;
    }

    createVehicleBundles.mutate({
      data: drivers,
      depotId: depotId,
      routeId: addToRoute ? routeId : undefined,
    });
  };

  const createNewDriverByLatLng = ({ lat, lng }: Coordinates) => {
    const driver = driverVehicleDataForNewLatLng(lat, lng);

    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.appendDriver(driver);
      return;
    }

    createVehicleBundles.mutate({
      data: [driver],
      depotId,
      routeId: routeId,
    });
  };

  const setDepotDrivers = ({ drivers }: DriverVehicleBundles) => {
    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.setDrivers(drivers);
      return;
    }

    overrideCurrentDepot.mutate({
      data: drivers,
      depotId,
    });
  };

  const setRouteDrivers = ({ drivers }: DriverVehicleBundles) => {
    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.setDrivers(drivers);
      return;
    }

    overrideCurrentRoutes.mutate({
      data: drivers,
      routeId,
    });
  };

  return {
    createNewDriver2,
    createNewDrivers,
    createNewDriverByLatLng,
    setDepotDrivers,
    setRouteDrivers,
  };
};
