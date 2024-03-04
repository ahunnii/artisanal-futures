import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { clientJobDataForNewLatLng } from "../../data/stop-data";
import type { ClientJobBundle } from "../../types.wip";

interface IUseStopsStore {
  locations: ClientJobBundle[];
  activeLocation: ClientJobBundle | null;
  jobSheetMode: string;

  setActiveLocation: (activeLocation: ClientJobBundle | null) => void;
  setActiveLocationById: (activeLocation: string | null) => void;

  setLocations: (locations: ClientJobBundle[]) => void;
  updateLocation: (id: string, data: Partial<ClientJobBundle>) => void;

  removeLocation: (id: string) => void;
  appendLocation: (location: ClientJobBundle) => void;
  addLocationByLatLng: (lat: number, lng: number) => void;

  isStopSheetOpen: boolean;
  setIsStopSheetOpen: (isOpen: boolean) => void;

  isFieldJobSheetOpen: boolean;
  setIsFieldJobSheetOpen: (isOpen: boolean) => void;

  setJobSheetMode: (mode: string) => void;

  // Lasso related selections
  selectedJobIds: string[];
  setSelectedJobIds: (ids: string[]) => void;  
}

export const useStopsStore = create<IUseStopsStore>()(
  persist(
    (set) => ({
      selectedJobIds: [],
      // Lasso related seelctions
      setSelectedJobIds: (ids) => set({ selectedJobIds: ids }),

      // OG
      locations: [],
      activeLocation: null,
      jobSheetMode: "create-new",

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
          locations: [...state.locations, clientJobDataForNewLatLng(lat, lng)],
        })),

      isStopSheetOpen: false,
      setIsStopSheetOpen: (isStopSheetOpen) => set({ isStopSheetOpen }),

      isFieldJobSheetOpen: false,
      setIsFieldJobSheetOpen: (isFieldJobSheetOpen) =>
        set({ isFieldJobSheetOpen }),

      setJobSheetMode: (jobSheetMode) => set({ jobSheetMode }),
    }),

    {
      name: "stop-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ locations: state.locations }),
      skipHydration: true,
    }
  )
);
