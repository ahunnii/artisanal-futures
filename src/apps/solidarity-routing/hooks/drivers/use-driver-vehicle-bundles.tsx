import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { useDrivers } from "./use-drivers";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import type { DriverVehicleBundle } from "../../types.wip";

//With two ways to use the application, this manages the state of the depot either from zustand or from the database
export const useDriverVehicleBundles = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const [pendingDrivers, setPendingDrivers] = useState<DriverVehicleBundle[]>(
    []
  );
  const apiContext = api.useContext();
  const searchParams = useSearchParams();

  const depotId = params?.depotId as string;

  const { data: session } = useSession();
  const user = session?.user ?? null;

  const { data: depotDrivers, isLoading } =
    api.drivers.getCurrentDepotDriverVehicleBundles.useQuery(
      { depotId: 1 },
      { enabled: user !== null }
    );

  // const { mutate: createDrivers, isLoading: isDriverMutationLoading } =
  //   api.drivers.createManyDriverAndVehicle.useMutation({
  //     onSuccess: () => {
  //       toast.success("Woohoo! Drivers created!");
  //     },
  //     onError: (e) => {
  //       console.log(e);
  //       toast.error("Oops! Something went wrong!");
  //     },
  //     onSettled: () => {
  //       clearDriverInput();
  //       void apiContext.drivers.invalidate();
  //     },
  //   });

  const sessionStorageDrivers = useDrivers((state) => state);

  const checkIfSearchParamExistsInDrivers = (id: string | null) => {
    return sessionStorageDrivers.drivers?.some(
      (driver) => driver.driver.id === id
    );
  };

  useEffect(() => {
    if (
      sessionStorageDrivers.drivers &&
      checkIfSearchParamExistsInDrivers(searchParams.get("driverId"))
    ) {
      setActiveById(searchParams.get("driverId"));
    }
  }, []);

  const updateDriverSearchParam = (id: number | string | null) => {
    const params = new URLSearchParams(searchParams);

    if (id) {
      params.set("driverId", `${id}`);
    } else {
      params.delete("driverId");
    }
    void router.replace(`${pathname}?${params.toString()}`);
  };

  const setActive = (id: string | null) => {
    if (user) {
      console.log(id);
      updateDriverSearchParam(id);

      if (user && depotDrivers) {
        const depotDriver = depotDrivers?.find(
          (bundle: DriverVehicleBundle) => bundle.driver.id === id
        );

        if (depotDriver) {
          sessionStorageDrivers.setActiveDriver(depotDriver);
        } else {
          sessionStorageDrivers.setActiveDriver(null);
        }
      }
    } else {
      sessionStorageDrivers.setActiveDriverById(id);
    }
  };

  const setActiveById = (id: string | null) => {
    if (sessionStorageDrivers.drivers) {
      updateDriverSearchParam(id);
      sessionStorageDrivers.setActiveDriverById(id);
    }
  };

  const isActive = (id: string) => {
    return sessionStorageDrivers.activeDriver?.driver.id === id;
  };

  const openDriverSheet = () =>
    sessionStorageDrivers.setIsDriverSheetOpen(true);

  const closeDriverSheet = () =>
    sessionStorageDrivers.setIsDriverSheetOpen(false);

  const setDriverSheetState = (state: boolean) =>
    sessionStorageDrivers.setIsDriverSheetOpen(state);

  const handleOnEdit = (id: string) => {
    setActiveById(id);
    openDriverSheet();
  };

  const setDrivers = ({
    drivers,
    saveToDB = false,
  }: {
    drivers: DriverVehicleBundle[];
    saveToDB?: boolean;
  }) => {
    sessionStorageDrivers.setDrivers(drivers);
  };

  //////
  const addDriver = (driver: DriverVehicleBundle, saveToDB: boolean) => {
    sessionStorageDrivers.appendDriver(driver);
  };

  const updateDriver = (
    id: string,
    data: Partial<DriverVehicleBundle>,
    saveToDB: boolean
  ) => {
    sessionStorageDrivers.updateDriver(id, data);
  };

  const removeDriver = (id: string, saveToDB: boolean) => {
    sessionStorageDrivers.removeDriver(id);
  };

  return {
    status: user ? "authenticated" : "unauthenticated",

    drivers: {
      all: sessionStorageDrivers.drivers,
      isLoading: user ? isLoading : false,
      setActive,
      setActiveById,
      isActive,
      openDriverSheet,
      closeDriverSheet,
      setDriverSheetState,
      edit: handleOnEdit,
      addDriver,
      updateDriver,
      setDrivers,
      removeDriver,
      isDriverSheetOpen: sessionStorageDrivers.isDriverSheetOpen,
      currentDriver: sessionStorageDrivers.activeDriver,
    },
  };
};
