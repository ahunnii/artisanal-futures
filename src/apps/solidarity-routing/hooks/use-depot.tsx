import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { Stop } from "~/apps/solidarity-routing/types";
import { stopData } from "../data/stop-data";

interface useStopsStore {
  locations: Stop[];
  activeLocation: Stop | null;
  setActiveLocation: (activeLocation: Stop | null) => void;
  setActiveLocationById: (activeLocation: number | null) => void;
  setLocations: (locations: Stop[]) => void;
  updateLocation: (id: number, data: Partial<Stop>) => void;
  removeLocation: (id: number) => void;
  appendLocation: (location: Stop) => void;
  addLocationByLatLng: (lat: number, lng: number) => void;

  isStopSheetOpen: boolean;
  setIsStopSheetOpen: (isOpen: boolean) => void;
}

export const useStops = create<useStopsStore>()(
  persist(
    (set) => ({
      isStopSheetOpen: false,
      setIsStopSheetOpen: (isStopSheetOpen) => set({ isStopSheetOpen }),
      locations: [],
      activeLocation: null,
      setActiveLocation: (activeLocation) => set({ activeLocation }),
      setActiveLocationById: (id) =>
        set((state) => ({
          activeLocation:
            state.locations.find((location) => location.id === id) ?? null,
        })),
      setLocations: (locations) => set({ locations }),
      updateLocation: (id, data) =>
        set((state) => ({
          locations: state.locations.map((location) =>
            location.id === id ? { ...location, ...data } : location
          ),
        })),
      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((location) => location.id !== id),
        })),
      appendLocation: (location) =>
        set((state) => ({ locations: [...state.locations, location] })),
      addLocationByLatLng: (lat, lng) =>
        set((state) => ({
          locations: [...state.locations, stopData(lat, lng)],
        })),
    }),
    {
      name: "stop-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ locations: state.locations }),
      skipHydration: true,
    }
  )
);
