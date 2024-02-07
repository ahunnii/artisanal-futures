import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDriversStore } from "../use-drivers-store";

import { usePathname } from "next/navigation";

import toast from "react-hot-toast";

export const useDeleteDriver = () => {
  const { data: session } = useSession();
  const sessionStorageDrivers = useDriversStore((state) => state);

  const pathname = usePathname();

  const apiContext = api.useContext();

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = (session?.user ?? null) && !isSandbox;

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
  };
};
