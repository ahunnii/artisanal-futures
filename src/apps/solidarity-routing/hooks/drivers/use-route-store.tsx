import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { driverVehicleDataForNewLatLng } from "../../data/driver-data";
import type { DriverVehicleBundle } from "../../types.wip";

interface useRouteStore {
  activeDriver: DriverVehicleBundle | null;

  setActiveDriver: (
    activeDriverVehicleBundle: DriverVehicleBundle | null
  ) => void;
  setActiveDriverById: (activeDriverVehicleBundle: string | null) => void;
}

export const useDriversStore = create<useRouteStore>()((set) => ({
  activeDriver: null,
  setActiveDriver: (activeDriver) => set({ activeDriver }),
  setActiveDriverById: (id) =>
    set((state) => ({
      activeDriver:
        state.drivers.find((bundle) => bundle.driver.id === id) ?? null,
    })),

  setDrivers: (drivers) => set({ drivers }),
  setSelectedDrivers: (selectedDrivers) => set({ selectedDrivers }),
}));
