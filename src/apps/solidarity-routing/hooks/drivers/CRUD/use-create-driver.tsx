import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import toast from "react-hot-toast";
import { driverVehicleDataForNewLatLng } from "~/apps/solidarity-routing/data/driver-data";
import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { useSolidarityState } from "../../optimized-data/use-solidarity-state";

type TCreateNewDriversProps = {
  driver: DriverVehicleBundle;
};

type Coordinates = {
  lat: number;
  lng: number;
};

export const useCreateDriver = () => {
  const { isUserAllowedToSaveToDepot, depotId, routeId } = useSolidarityState();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const apiContext = api.useContext();

  const createVehicleBundles = api.drivers.createVehicleBundles.useMutation({
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

  const overrideCurrentDepot = api.drivers.setDepotVehicles.useMutation({
    onSuccess: () => toast.success("Woohoo! Drivers created!"),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const overrideCurrentRoutes = api.routePlan.setRouteVehicles.useMutation({
    onSuccess: () =>
      toast.success("Drivers were successfully added to the route."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
      sessionStorageDrivers.setIsDriverSheetOpen(false);
      sessionStorageDrivers.setActiveDriver(null);
    },
  });

  const createNewDriver = ({ driver }: TCreateNewDriversProps) => {
    if (isUserAllowedToSaveToDepot) {
      createVehicleBundles.mutate({
        data: [driver],
        depotId: Number(depotId),
        routeId: routeId as string,
      });
    } else {
      sessionStorageDrivers.appendDriver(driver);
    }
  };

  const createNewDrivers = ({
    drivers,
    addToRoute,
  }: {
    drivers: DriverVehicleBundle[];
    addToRoute?: boolean;
  }) => {
    if (isUserAllowedToSaveToDepot) {
      createVehicleBundles.mutate({
        data: drivers,
        depotId: Number(depotId),
        routeId: addToRoute ? (routeId as string) : undefined,
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
        depotId: Number(depotId),
        routeId: routeId as string,
      });
    } else {
      sessionStorageDrivers.appendDriver(driver);
    }
  };

  const setDepotDrivers = ({ drivers }: { drivers: DriverVehicleBundle[] }) => {
    if (isUserAllowedToSaveToDepot) {
      overrideCurrentDepot.mutate({
        data: drivers,
        depotId: Number(depotId),
      });
    } else {
      sessionStorageDrivers.setDrivers(drivers);
    }
  };

  const setRouteDrivers = ({ drivers }: { drivers: DriverVehicleBundle[] }) => {
    if (isUserAllowedToSaveToDepot) {
      overrideCurrentRoutes.mutate({
        data: drivers,
        routeId: routeId as string,
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
