import { notificationService } from "~/services/notification";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useDriversStore } from "~/apps/solidarity-routing/stores/use-drivers-store";

import { api } from "~/utils/api";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

type UpdateProps = {
  bundle: DriverVehicleBundle;
};

type UpdateWithIdProps = {
  id: string | undefined;
} & UpdateProps;
export const useUpdateDriver = () => {
  const invalidateData = () => {
    void apiContext.drivers.invalidate();
    void apiContext.routePlan.invalidate();
  };

  const { isUserAllowedToSaveToDepot, routeId, depotId } = useSolidarityState();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const apiContext = api.useContext();

  const updateDriverDefaults = api.drivers.updateDriverDefaults.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Driver defaults were successfully updated.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with updating driver defaults.",
        error,
      }),

    onSettled: invalidateData,
  });

  const updateVehicleDetails = api.drivers.updateVehicleDetails.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Vehicle details were successfully updated.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with updating vehicle details.",
        error,
      }),

    onSettled: invalidateData,
  });

  const updateDriverDetails = api.drivers.updateDriverDetails.useMutation({
    onSuccess: () =>
      notificationService.notifySuccess({
        message: "Driver details were successfully updated.",
      }),
    onError: (error: unknown) =>
      notificationService.notifyError({
        message: "Oops! Something went wrong with updating driver details.",
        error,
      }),
    onSettled: invalidateData,
  });

  const updateRouteVehicle = ({ bundle }: UpdateProps) => {
    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
      return;
    }

    updateVehicleDetails.mutate({
      vehicle: bundle.vehicle,
      routeId: routeId,
    });
  };

  const updateDepotDriverDetails = ({ bundle }: UpdateProps) => {
    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
      return;
    }

    updateDriverDetails.mutate({
      driverId: bundle.driver.id,
      driver: bundle.driver,
    });
  };

  const updateDepotDriverDefaults = ({ id, bundle }: UpdateWithIdProps) => {
    if (!isUserAllowedToSaveToDepot) {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
      return;
    }

    if (!id) throw new Error("No default vehicle id");

    updateDriverDefaults.mutate({
      bundle,
      defaultId: id,
      depotId: depotId,
    });
  };

  return {
    updateRouteVehicle,
    updateDepotDriverDetails,
    updateDepotDriverDefaults,
  };
};
