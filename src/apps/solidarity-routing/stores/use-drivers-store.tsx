import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { driverVehicleDataForNewLatLng } from "../data/driver-data";
import type { DriverVehicleBundle } from "../types.wip";

interface useDriversStore {
  drivers: DriverVehicleBundle[];
  selectedDrivers: DriverVehicleBundle[];
  activeDriver: DriverVehicleBundle | null;

  setActiveDriver: (
    activeDriverVehicleBundle: DriverVehicleBundle | null
  ) => void;
  setActiveDriverById: (activeDriverVehicleBundle: string | null) => void;

  setDrivers: (driverVehicleBundles: DriverVehicleBundle[]) => void;
  setSelectedDrivers: (driverVehicleBundles: DriverVehicleBundle[]) => void;
  updateDriver: (id: string, data: Partial<DriverVehicleBundle>) => void;

  removeDriver: (id: string) => void;
  appendDriver: (driverVehicleBundle: DriverVehicleBundle) => void;
  addDriverByLatLng: (lat: number, lng: number) => void;

  isDriverSheetOpen: boolean;
  setIsDriverSheetOpen: (isOpen: boolean) => void;

  isDriverRoutePanelOpen: boolean;
  setIsDriverRoutePanelOpen: (isOpen: boolean) => void;

  isDriverMessagePanelOpen: boolean;
  setIsDriverMessagePanelOpen: (isOpen: boolean) => void;
}

export const useDriversStore = create<useDriversStore>()(
  persist(
    (set) => ({
      drivers: [],
      selectedDrivers: [],
      activeDriver: null,
      setActiveDriver: (activeDriver) => set({ activeDriver }),
      setActiveDriverById: (id) =>
        set((state) => ({
          activeDriver:
            state.drivers.find((bundle) => bundle.driver.id === id) ?? null,
        })),

      setDrivers: (drivers) => set({ drivers }),
      setSelectedDrivers: (selectedDrivers) => set({ selectedDrivers }),

      updateDriver: (id, data) =>
        set((state) => ({
          drivers: state.drivers.map((bundle) =>
            bundle.driver.id === id ? { ...bundle, ...data } : bundle
          ),
        })),
      removeDriver: (id) =>
        set((state) => ({
          drivers: state.drivers.filter((bundle) => bundle.driver.id !== id),
        })),
      appendDriver: (driver) =>
        set((state) => ({ drivers: [...state.drivers, driver] })),

      addDriverByLatLng: (lat, lng) =>
        set((state) => ({
          drivers: [...state.drivers, driverVehicleDataForNewLatLng(lat, lng)],
        })),

      isDriverSheetOpen: false,
      setIsDriverSheetOpen: (isDriverSheetOpen) => set({ isDriverSheetOpen }),

      isDriverRoutePanelOpen: false,
      setIsDriverRoutePanelOpen: (isDriverRoutePanelOpen) =>
        set({ isDriverRoutePanelOpen }),

      isDriverMessagePanelOpen: false,
      setIsDriverMessagePanelOpen: (isDriverMessagePanelOpen) =>
        set({ isDriverMessagePanelOpen }),
    }),
    {
      name: "driver-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ drivers: state.drivers }),
      skipHydration: true,
    }
  )
);
