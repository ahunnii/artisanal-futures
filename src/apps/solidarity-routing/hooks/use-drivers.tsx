import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { Driver } from "~/components/tools/routing/types";
import { driverData } from "../data/driver-data";

interface useDriversStore {
  drivers: Driver[];
  selectedDrivers: Driver[];
  activeDriver: Driver | null;
  setActiveDriver: (activeDriver: Driver | null) => void;
  setActiveDriverById: (activeDriver: number | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  setSelectedDrivers: (drivers: Driver[]) => void;
  updateDriver: (id: number, data: Partial<Driver>) => void;
  removeDriver: (id: number) => void;
  appendDriver: (driver: Driver) => void;
  addDriverByLatLng: (lat: number, lng: number) => void;

  isDriverSheetOpen: boolean;
  setIsDriverSheetOpen: (isOpen: boolean) => void;
}

export const useDrivers = create<useDriversStore>()(
  persist(
    (set) => ({
      isDriverSheetOpen: false,
      setIsDriverSheetOpen: (isDriverSheetOpen) => set({ isDriverSheetOpen }),
      drivers: [],
      selectedDrivers: [],
      activeDriver: null,
      setActiveDriver: (activeDriver) => set({ activeDriver }),
      setActiveDriverById: (id) =>
        set((state) => ({
          activeDriver:
            state.drivers.find((driver) => driver.id === id) ?? null,
        })),
      setDrivers: (drivers) => set({ drivers }),
      setSelectedDrivers: (selectedDrivers) => set({ selectedDrivers }),
      updateDriver: (id, data) =>
        set((state) => ({
          drivers: state.drivers.map((driver) =>
            driver.id === id ? { ...driver, ...data } : driver
          ),
        })),
      removeDriver: (id) =>
        set((state) => ({
          drivers: state.drivers.filter((driver) => driver.id !== id),
        })),
      appendDriver: (driver) =>
        set((state) => ({ drivers: [...state.drivers, driver] })),
      addDriverByLatLng: (lat, lng) =>
        set((state) => ({ drivers: [...state.drivers, driverData(lat, lng)] })),
    }),
    {
      name: "driver-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ drivers: state.drivers }),
      skipHydration: true,
    }
  )
);
