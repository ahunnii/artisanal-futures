import toast from "react-hot-toast";

import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import type { DriverVehicleBundle } from "~/apps/solidarity-routing/types.wip";
import { useUrlParams } from "~/hooks/use-url-params";

import { useSolidarityState } from "../../optimized-data/use-solidarity-state";

export const useUpdateDriver = () => {
  // const routePlan = useRoutePlans();

  const { updateUrlParams } = useUrlParams();

  const { isUserAllowedToSaveToDepot, routeId, depotId } = useSolidarityState();

  const sessionStorageDrivers = useDriversStore((state) => state);

  const apiContext = api.useContext();

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
      updateUrlParams({ key: "regenerate", value: "true" });
      // if (routePlan.optimized.length > 0) {
      //   updateUrlParams({ key: "modified", value: "true" });
      // }
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
        routeId: routeId as string,
      });
    } else {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
    }
  };

  const updateDepotDriverDetails = ({
    bundle,
  }: {
    bundle: DriverVehicleBundle;
  }) => {
    if (isUserAllowedToSaveToDepot) {
      updateDriverDetails.mutate({
        driverId: bundle.driver.id,
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
        depotId: Number(depotId),
      });
    } else {
      sessionStorageDrivers.updateDriver(bundle.vehicle.id, bundle);
    }
  };

  return {
    updateRouteVehicle,
    updateDepotDriverDetails,
    updateDepotDriverDefaults,
  };
};
