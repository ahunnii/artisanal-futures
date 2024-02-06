import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDriversStore } from "./use-drivers-store";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import type { DriverVehicleBundle } from "../../types.wip";
import { updateSearchParams } from "../../utils/generic/update-search-params";
import { depotDrivers } from "./use-vehicles-db";

//With two ways to use the application, this manages the state of the depot either from zustand or from the database
export const useDriverVehicleBundles = () => {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const apiContext = api.useContext();
  const searchParams = useSearchParams();

  const depotId = Number(params?.depotId as string);
  const routeId = params?.routeId as string;
  const areQueriesEnabled = status === "authenticated";

  const user = session?.user ?? null;

  const isSandbox = pathname?.includes("sandbox");

  // const { data: databaseDrivers } = depotDrivers();

  const defaultError = (e: unknown) => {
    console.log(e);
    toast.error("Oops! Something went wrong!");
  };
  const defaultSettled = () => {
    void apiContext.drivers.invalidate();
    void apiContext.routePlan.invalidate();
  };

  const createDepotDriverVehicleBundles =
    api.drivers.createManyDriverAndVehicle.useMutation({
      onSuccess: () => toast.success("Woohoo! Drivers created!"),
      onError: defaultError,
      onSettled: defaultSettled,
    });

  const createNewDriver = api.drivers.createVehicleBundles.useMutation({
    onSuccess: () => toast.success("Driver created"),
    onError: defaultError,
    onSettled: () => {
      defaultSettled();

      sessionStorageDrivers.setIsDriverEditPanelOpen(false);
      setActiveDriver(null);
    },
  });

  const databaseDrivers =
    api.drivers.getCurrentDepotDriverVehicleBundles.useQuery(
      { depotId },
      { enabled: areQueriesEnabled }
    );

  const setRouteVehicles = api.routePlan.setRouteVehicles.useMutation({
    onSuccess: () => toast.success("Vehicles added to route"),
    onError: defaultError,
    onSettled: defaultSettled,
  });

  const updateDriverDefaults =
    api.drivers.updateDriverDefaultVehicle.useMutation({
      onSuccess: () => toast.success("Driver updated"),
      onError: defaultError,
      onSettled: defaultSettled,
    });

  const getRouteVehicles = api.routePlan.getVehicleBundles.useQuery({
    routeId,
  });

  const updateRouteVehicle = api.drivers.updateRouteVehicle.useMutation({
    onSuccess: () => toast.success("Vehicle updated"),
    onError: defaultError,
    onSettled: defaultSettled,
  });

  const sessionStorageDrivers = useDriversStore((state) => state);

  const checkIfSearchParamExistsInDrivers = (id: string | null) => {
    return sessionStorageDrivers.drivers?.some(
      (driver) => driver.driver.id === id
    );
  };

  const updateDriverSearchParam = (id: number | string | null) => {
    const updatedParams = updateSearchParams({
      id,
      searchParams,
      type: "driver",
    });

    void router.replace(`${pathname}?${updatedParams}`);
  };

  const openDriverSheet = () =>
    sessionStorageDrivers.setIsDriverSheetOpen(true);

  const setDriverSheetState = (state: boolean) =>
    sessionStorageDrivers.setIsDriverSheetOpen(state);

  const addDriversToDepot = ({
    drivers,
    saveToDB = false,
  }: {
    drivers: DriverVehicleBundle[];
    saveToDB?: boolean;
  }) => {
    // sessionStorageDrivers.setDrivers(drivers);

    if (user) console.log(drivers);
    createDepotDriverVehicleBundles.mutate({
      data: drivers,
      depotId: Number(depotId),
    });
  };

  //////

  const getDriverById = (id: string | null | undefined) => {
    if (!id) return {};
    return sessionStorageDrivers.drivers?.find(
      (driver) => driver.driver.id === id
    )?.driver;
  };

  ////////////////////////////////////////////////////////////////////////////

  const setActiveDriver = (id: string | null) => {
    updateDriverSearchParam(id);

    if (user && !isSandbox) {
      // Check if the route has data
      if (getRouteVehicles.data) {
        // Find the driver in the route
        const depotDriver = (
          getRouteVehicles.data as unknown as DriverVehicleBundle[]
        )?.find((bundle: DriverVehicleBundle) => bundle.vehicle.id === id);

        console.log(depotDriver);
        // Assign the driver to the active driver or null if not found
        if (depotDriver) sessionStorageDrivers.setActiveDriver(depotDriver);
        else sessionStorageDrivers.setActiveDriver(null);
      }
    } else {
      // If the user is not authenticated, set the active driver from the zustand store
      if (sessionStorageDrivers.drivers)
        sessionStorageDrivers.setActiveDriverById(id);
      else sessionStorageDrivers.setActiveDriver(null);
    }
  };

  const setEditData = (id: string | null) => {
    updateDriverSearchParam(id);

    if (user && !isSandbox) {
      // Check if the route has data
      if (getRouteVehicles.data) {
        // Find the driver in the route
        const depotDriver = (
          databaseDrivers.data as unknown as DriverVehicleBundle[]
        )?.find((bundle: DriverVehicleBundle) => bundle.vehicle.id === id);

        console.log(depotDriver);
        // Assign the driver to the active driver or null if not found
        if (depotDriver) sessionStorageDrivers.setActiveDriver(depotDriver);
        else sessionStorageDrivers.setActiveDriver(null);
      }
    } else {
      // If the user is not authenticated, set the active driver from the zustand store
      if (sessionStorageDrivers.drivers)
        sessionStorageDrivers.setActiveDriverById(id);
      else sessionStorageDrivers.setActiveDriver(null);
    }
  };

  type TAddDriversProps = {
    drivers: DriverVehicleBundle[];
    saveToDB?: boolean;
  };

  //Assigns drivers to the route
  const addDriversToRoute = ({ drivers }: TAddDriversProps) => {
    if (user && !isSandbox) {
      createRouteVehicles.mutate({
        data: drivers,
        routeId,
      });
    } else {
      sessionStorageDrivers.setDrivers(drivers);
    }
  };
  // Assigns drivers to the route
  const createRouteVehicles = api.routePlan.createRouteVehicles.useMutation({
    onSuccess: () =>
      toast.success("Drivers were successfully added to the route."),
    onError: defaultError,
    onSettled: () => {
      defaultSettled();
      sessionStorageDrivers.setIsDriverEditPanelOpen(false);
      setActiveDriver(null);
    },
  });

  const fullDriverDeletion = api.drivers.deleteDriver.useMutation({
    onSuccess: () =>
      toast.success("Drivers were successfully added to the route."),
    onError: defaultError,
    onSettled: () => {
      defaultSettled();
      sessionStorageDrivers.setIsDriverEditPanelOpen(false);
      setActiveDriver(null);
    },
  });

  const setDepotDrivers = ({ drivers }: { drivers: DriverVehicleBundle[] }) => {
    if (user && !isSandbox) {
      createDepotDriverVehicleBundles.mutate({
        data: drivers,
        depotId: Number(depotId),
      });
    } else {
      sessionStorageDrivers.setDrivers(drivers);
    }
  };

  const setRouteDrivers = ({ drivers }: TAddDriversProps) => {
    console.log(drivers);
    if (user && !isSandbox) {
      setRouteVehicles.mutate({
        data: drivers,
        routeId,
      });
    } else {
      sessionStorageDrivers.setDrivers(drivers);
    }
  };

  const updateDriverDefault = (
    driverId: string | undefined,
    data: DriverVehicleBundle
  ) => {
    if (!driverId) return;

    if (user && !isSandbox) {
      updateDriverDefaults.mutate({
        driverId,
        depotId,
        data,
      });
    }
  };

  const updateVehicle = ({
    vehicleId,
    data,
  }: {
    vehicleId: string | undefined;
    data: DriverVehicleBundle;
  }) => {
    if (!vehicleId) return;

    if (user && !isSandbox) {
      updateRouteVehicle.mutate({
        vehicleId,
        depotId,
        data,
      });
    } else {
      sessionStorageDrivers.updateDriver(vehicleId, data);
    }
  };

  const createAndConnectNewDriver = ({
    driver,
  }: {
    driver: DriverVehicleBundle;
  }) => {
    if (user && !isSandbox) {
      createNewDriver.mutate({
        data: [driver],
        depotId: Number(depotId),
        routeId,
      });
    } else {
      sessionStorageDrivers.appendDriver(driver);
    }
  };

  useEffect(() => {
    if (
      sessionStorageDrivers.drivers &&
      checkIfSearchParamExistsInDrivers(searchParams.get("driverId"))
    ) {
      setActiveDriver(searchParams.get("driverId"));
    }
  }, []);

  return {
    data:
      user && !isSandbox
        ? (getRouteVehicles.data as unknown as DriverVehicleBundle[]) ??
          sessionStorageDrivers.drivers ??
          ([] as DriverVehicleBundle[])
        : sessionStorageDrivers.drivers ?? ([] as DriverVehicleBundle[]),

    isDataLoading: user && !isSandbox ? getRouteVehicles.isLoading : false,

    fromStoreState: sessionStorageDrivers.drivers ?? [],
    fromDepot: databaseDrivers.data ?? [],

    active: sessionStorageDrivers.activeDriver,
    isActive: (id: string) => {
      return sessionStorageDrivers.activeDriver?.vehicle.id === id;
    },

    edit: (id: string) => {
      setActiveDriver(id);
      setEditData(id);
      setDriverSheetState(true);
    },

    updateDriver: updateVehicle,

    setRouteDrivers,

    isSheetOpen: sessionStorageDrivers.isDriverSheetOpen,
    onSheetOpenChange: (state: boolean) => {
      if (!state) setActiveDriver(null);
      setDriverSheetState(state);
    },
    openSheet: openDriverSheet,

    ////////////////CRUD
    addNew: createAndConnectNewDriver,
    addDriversToDepot,
    addByLatLng: sessionStorageDrivers.addDriverByLatLng,

    updateDefault: updateDriverDefault,
    update: updateVehicle,

    assign: addDriversToRoute,
    assignToDepot: setDepotDrivers,

    deletePermanently: (id: string | null) => {
      if (id)
        fullDriverDeletion.mutate({
          driverId: id,
          deleteVehicles: true,
        });
    },

    getDriverById,
    isQuickAddOpen: sessionStorageDrivers.isDriverEditPanelOpen,
    setIsQuickAddOpen: sessionStorageDrivers.setIsDriverEditPanelOpen,

    onQuickAddChange: (state: boolean) => {
      if (!state) setActiveDriver(null);
      sessionStorageDrivers.setIsDriverEditPanelOpen(state);
    },
  };
};

// If the user is authenticated, the data is fetched from the database, else it is fetched from the zustand store.
