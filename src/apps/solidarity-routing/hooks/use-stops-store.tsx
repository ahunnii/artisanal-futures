import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { stopData } from "../data/stops/stop-data";
import type { ClientJobBundle } from "../types.wip";

interface IUseStopsStore {
  locations: ClientJobBundle[];
  activeLocation: ClientJobBundle | null;

  setActiveLocation: (activeLocation: ClientJobBundle | null) => void;
  setActiveLocationById: (activeLocation: string | null) => void;

  setLocations: (locations: ClientJobBundle[]) => void;
  updateLocation: (id: string, data: Partial<ClientJobBundle>) => void;

  removeLocation: (id: string) => void;
  appendLocation: (location: ClientJobBundle) => void;
  addLocationByLatLng: (lat: number, lng: number) => void;

  isStopSheetOpen: boolean;
  setIsStopSheetOpen: (isOpen: boolean) => void;
}

export const useStopsStore = create<IUseStopsStore>()(
  persist(
    (set) => ({
      locations: [],
      activeLocation: null,

      setActiveLocation: (activeLocation) => set({ activeLocation }),
      setActiveLocationById: (id) =>
        set((state) => ({
          activeLocation:
            state.locations.find((location) => location.job.id === id) ?? null,
        })),

      setLocations: (locations) => set({ locations }),
      updateLocation: (id, data) =>
        set((state) => ({
          locations: state.locations.map((location) =>
            location.job.id === id ? { ...location, ...data } : location
          ),
        })),

      removeLocation: (id) =>
        set((state) => ({
          locations: state.locations.filter((bundle) => bundle.job.id !== id),
        })),
      appendLocation: (location) =>
        set((state) => ({ locations: [...state.locations, location] })),
      addLocationByLatLng: (lat, lng) =>
        set((state) => ({
          locations: [...state.locations, stopData(lat, lng)],
        })),

      isStopSheetOpen: false,
      setIsStopSheetOpen: (isStopSheetOpen) => set({ isStopSheetOpen }),
    }),
    {
      name: "stop-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ locations: state.locations }),
      skipHydration: true,
    }
  )
);
