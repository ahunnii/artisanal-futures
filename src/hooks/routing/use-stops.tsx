import { create } from "zustand";
import type { Stop } from "~/components/tools/routing/types";

interface useStopsStore {
  locations: Stop[];
  activeLocation: Stop | null;
  setActiveLocation: (activeLocation: Stop | null) => void;
  setActiveLocationById: (activeLocation: number | null) => void;
  setLocations: (locations: Stop[]) => void;
  updateLocation: (id: number, data: Partial<Stop>) => void;
  removeLocation: (id: number) => void;
  appendLocation: (location: Stop) => void;
}

export const useStops = create<useStopsStore>((set) => ({
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
}));
