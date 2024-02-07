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

export const useCreateDriver = () => {
  const { data: session } = useSession();
  const sessionStorageDrivers = useDriversStore((state) => state);

  const pathname = usePathname();

  const params = useParams();

  const apiContext = api.useContext();

  const depotId = Number(params?.depotId as string);
  const routeId = params?.routeId as string;

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = (session?.user ?? null) && !isSandbox;

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
        routeId,
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
        routeId: addToRoute ? routeId : undefined,
      });
    } else {
      drivers.forEach((driver) => {
        sessionStorageDrivers.appendDriver(driver);
      });
    }
  };

  const createNewDriverByLatLng = ({ lat, lng }: Coordinates) => {
    const driver = driverData(lat, lng);

    if (isUserAllowedToSaveToDepot) {
      createVehicleBundles.mutate({
        data: [driver],
        depotId: Number(depotId),
        routeId,
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
        routeId,
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
