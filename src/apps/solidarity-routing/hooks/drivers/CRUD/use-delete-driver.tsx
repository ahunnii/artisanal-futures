import { notificationService } from "~/services/notification";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useDriversStore } from "~/apps/solidarity-routing/stores/use-drivers-store";

import { api } from "~/utils/api";

export const useDeleteDriver = () => {
  const apiContext = api.useContext();
  const { isUserAllowedToSaveToDepot, depotId } = useSolidarityState();
  const sessionStorageDrivers = useDriversStore((state) => state);

  const invalidateData = () => {
    void apiContext.drivers.invalidate();
    void apiContext.routePlan.invalidate();
  };

  const deleteFromRoute = api.drivers.deleteVehicle.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Vehicles(s) successfully deleted from route.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with deleting the vehicle",
        error,
      }),

    onSettled: invalidateData,
  });

  const deleteFromDepot = api.drivers.deleteVehicleBundle.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Driver(s) successfully deleted from depot.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with deleting the driver",
        error,
      }),

    onSettled: invalidateData,
  });

  const purgeAllDrivers = api.drivers.deleteAllDepotDrivers.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Driver(s) successfully purged from depot.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with deleting the depot drivers",
        error,
      }),
    onSettled: invalidateData,
  });

  const purgeAllVehicles = api.drivers.deleteAllVehicles.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Vehicles(s) successfully purged from depot.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with deleting the depot vehicles",
        error,
      }),
    onSettled: invalidateData,
  });

  const deleteDriverFromRoute = ({
    vehicleId,
  }: {
    vehicleId: string | undefined;
  }) => {
    if (!isUserAllowedToSaveToDepot) {
      const temp = sessionStorageDrivers.drivers.filter(
        (loc) => loc.driver.id !== sessionStorageDrivers.activeDriver?.driver.id
      );
      sessionStorageDrivers.setDrivers(temp);
      return;
    }

    if (!vehicleId) return;

    deleteFromRoute.mutate({
      vehicleId,
    });
  };

  const deleteDriverFromDepot = ({
    vehicleId,
    driverId,
  }: {
    vehicleId: string;
    driverId: string;
  }) => {
    if (!isUserAllowedToSaveToDepot)
      throw new Error("Depots are not a thing in the sandbox.");

    deleteFromDepot.mutate({
      vehicleId,
      driverId,
    });
  };

  return {
    deleteDriverFromRoute,
    deleteDriverFromDepot,
    purgeAllDrivers: () => void purgeAllDrivers.mutate({ depotId }),
    purgeAllVehicles: () => void purgeAllVehicles.mutate({ depotId }),
    purgeAllDriverVehicleBundles: () => {
      void purgeAllDrivers.mutate({ depotId });
      void purgeAllVehicles.mutate({ depotId });
    },
  };
};
