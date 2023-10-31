import { create } from "zustand";
import type { Driver } from "~/components/tools/routing/types";

interface useDriversStore {
  drivers: Driver[];
  activeDriver: Driver | null;
  setActiveDriver: (activeDriver: Driver | null) => void;
  setActiveDriverById: (activeDriver: number | null) => void;
  setDrivers: (drivers: Driver[]) => void;
  updateDriver: (id: number, data: Partial<Driver>) => void;
  removeDriver: (id: number) => void;
  appendDriver: (driver: Driver) => void;
}

export const useDrivers = create<useDriversStore>((set) => ({
  drivers: [],
  activeDriver: null,
  setActiveDriver: (activeDriver) => set({ activeDriver }),
  setActiveDriverById: (id) =>
    set((state) => ({
      activeDriver: state.drivers.find((driver) => driver.id === id) ?? null,
    })),
  setDrivers: (drivers) => set({ drivers }),
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
}));
