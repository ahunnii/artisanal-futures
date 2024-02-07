import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import { useParams, usePathname } from "next/navigation";

import toast from "react-hot-toast";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";

export const useUpdateDriver = () => {
  const { data: session } = useSession();
  const sessionStorageDrivers = useDriversStore((state) => state);

  const pathname = usePathname();

  const params = useParams();

  const apiContext = api.useContext();

  const routeId = params?.routeId as string;

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = (session?.user ?? null) && !isSandbox;

  const updateDriverDefaults = api.drivers.updateDriverDefaults.useMutation({
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
  const updateVehicleDetails = api.drivers.updateVehicleDetails.useMutation({
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
  const updateDriverDetails = api.drivers.updateDriverDetails.useMutation({
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

  const updateRouteVehicle = ({ bundle }: { bundle: DriverVehicleBundle }) => {
    if (isUserAllowedToSaveToDepot) {
      updateVehicleDetails.mutate({
        vehicle: bundle.vehicle,
        routeId,
      });
    } else {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
    }
  };

  const updateDepotDriverDetails = (bundle: DriverVehicleBundle) => {
    if (isUserAllowedToSaveToDepot) {
      updateDriverDetails.mutate({
        id: bundle.driver.id,
        driver: bundle.driver,
      });
    } else {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
    }
  };

  const updateDepotDriverDefaults = (
    id: string | undefined,
    bundle: DriverVehicleBundle
  ) => {
    if (isUserAllowedToSaveToDepot) {
      //TODO: Allow for this to create defaults if the driver has none
      if (!id) throw new Error("No default vehicle id");
      updateDriverDefaults.mutate({
        bundle,
        defaultId: id,
      });
    } else {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
    }
  };

  // Update a driver's details (reflects in depot)
  // Update a driver's defaults (reflects in depot)
  // Update a vehicle's details in the route

  return {
    updateRouteVehicle,
    updateDepotDriverDetails,
    updateDepotDriverDefaults,
  };
};
