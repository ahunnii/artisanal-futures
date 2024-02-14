import toast from "react-hot-toast";

import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import { useSolidarityState } from "../../optimized-data/use-solidarity-state";

export const useDeleteDriver = () => {
  const apiContext = api.useContext();
  const { isUserAllowedToSaveToDepot, depotId } = useSolidarityState();
  const sessionStorageDrivers = useDriversStore((state) => state);

  const deleteFromRoute = api.drivers.deleteVehicle.useMutation({
    onSuccess: () => toast.success("Driver(s) successfully created."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const deleteFromDepot = api.drivers.deleteVehicleBundle.useMutation({
    onSuccess: () => toast.success("Driver(s) successfully created."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const purgeAllDrivers = api.drivers.deleteAllDepotDrivers.useMutation({
    onSuccess: () => {
      toast.success("Drivers deleted!");
    },
    onError: (e) => {
      toast.error("There seems to be an issue with deleting your drivers.");
      console.log(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
    },
  });

  const purgeAllVehicles = api.vehicles.deleteAllDepotVehicles.useMutation({
    onSuccess: () => {
      toast.success("Vehicles deleted!");
    },
    onError: (e) => {
      toast.error("There seems to be an issue with deleting your vehicles.");
      console.log(e);
    },
    onSettled: () => {
      void apiContext.vehicles.invalidate();
    },
  });

  const deleteDriverFromRoute = ({
    vehicleId,
  }: {
    vehicleId: string | undefined;
  }) => {
    if (isUserAllowedToSaveToDepot && vehicleId) {
      deleteFromRoute.mutate({
        vehicleId,
      });
    } else {
      const temp = sessionStorageDrivers.drivers.filter(
        (loc) => loc.driver.id !== sessionStorageDrivers.activeDriver?.driver.id
      );
      sessionStorageDrivers.setDrivers(temp);
    }
  };

  const deleteDriverFromDepot = ({
    vehicleId,
    driverId,
  }: {
    vehicleId: string;
    driverId: string;
  }) => {
    if (isUserAllowedToSaveToDepot) {
      deleteFromDepot.mutate({
        vehicleId,
        driverId,
      });
    } else {
      throw new Error("Depots are not a thing in the sandbox.");
    }
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
