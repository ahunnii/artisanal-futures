import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import { driverVehicleDataForNewLatLng } from "~/apps/solidarity-routing/data/driver-data";
import type {
  Coordinates,
  DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { notificationService } from "~/services/notification";
import { useSolidarityState } from "../../optimized-data/use-solidarity-state";

type TCreateNewDriverProps = {
  driver: DriverVehicleBundle;
};

type DriverVehicleBundles = { drivers: DriverVehicleBundle[] };

type TCreateNewDriversProps = {
  addToRoute?: boolean;
} & DriverVehicleBundles;

export const useCreateDriver = () => {
  const { isUserAllowedToSaveToDepot, depotId, routeId } = useSolidarityState();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const apiContext = api.useContext();

  const createDriverChannels =
    api.routeMessaging.createDriverChannels.useMutation({
      onSuccess: () =>
        notificationService.notifySuccess({
          message: "Driver channels has been successfully created.",
        }),

      onError: (error) =>
        notificationService.notifyError({
          message:
            "Something went wrong with creating the driver channels. Please try again.",
          error,
        }),
    });

  const createVehicleBundles = api.drivers.createVehicleBundles.useMutation({
    onSuccess: (data: DriverVehicleBundle[]) => {
      notificationService.notifySuccess({
        message: "Driver(s) successfully created.",
      });

      const driverIds = data.map(
        (driver: DriverVehicleBundle) => driver.driver.id
      );

      createDriverChannels.mutate({
        depotId: depotId,
        bundles: driverIds,
      });
    },

    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "There was an issue creating the driver(s). Please try again.",
        error,
      }),
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
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
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
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
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();

      sessionStorageDrivers.setIsDriverSheetOpen(false);
      sessionStorageDrivers.setActiveDriver(null);
    },
  });

  const createNewDriver = ({ driver }: TCreateNewDriverProps) => {
    if (isUserAllowedToSaveToDepot) {
      createVehicleBundles.mutate({
        data: [driver],
        depotId: depotId,
        routeId: routeId,
      });
    } else {
      sessionStorageDrivers.appendDriver(driver);
    }
  };

  const createNewDrivers = ({
    drivers,
    addToRoute,
  }: TCreateNewDriversProps) => {
    if (isUserAllowedToSaveToDepot) {
      createVehicleBundles.mutate({
        data: drivers,
        depotId: depotId,
        routeId: addToRoute ? routeId : undefined,
      });
    } else {
      drivers.forEach((driver) => {
        sessionStorageDrivers.appendDriver(driver);
      });
    }
  };

  const createNewDriverByLatLng = ({ lat, lng }: Coordinates) => {
    const driver = driverVehicleDataForNewLatLng(lat, lng);

    if (isUserAllowedToSaveToDepot) {
      createVehicleBundles.mutate({
        data: [driver],
        depotId,
        routeId: routeId,
      });
    } else {
      sessionStorageDrivers.appendDriver(driver);
    }
  };

  const setDepotDrivers = ({ drivers }: DriverVehicleBundles) => {
    if (isUserAllowedToSaveToDepot) {
      overrideCurrentDepot.mutate({
        data: drivers,
        depotId,
      });
    } else {
      sessionStorageDrivers.setDrivers(drivers);
    }
  };

  const setRouteDrivers = ({ drivers }: DriverVehicleBundles) => {
    if (isUserAllowedToSaveToDepot) {
      overrideCurrentRoutes.mutate({
        data: drivers,
        routeId: routeId,
      });
    } else {
      sessionStorageDrivers.setDrivers(drivers);
    }
  };

  return {
    createNewDriver,
    createNewDrivers,
    createNewDriverByLatLng,
    setDepotDrivers,
    setRouteDrivers,
  };
};
