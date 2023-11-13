import { uniqueId } from "lodash";
import { create } from "zustand";
import type { Stop } from "~/components/tools/routing/types";

const stopData = (lat: number, lng: number) => {
  return {
    id: parseInt(uniqueId()),
    customer_name: "New Stop",
    address: "Address via LatLng",
    drop_off_duration: 5,
    prep_time_duration: 0,
    time_windows: [{ startTime: "09:00", endTime: "17:00" }],
    priority: 1,
    coordinates: { latitude: lat, longitude: lng },
  };
};

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
  addLocationByLatLng: (lat, lng) =>
    set((state) => ({ locations: [...state.locations, stopData(lat, lng)] })),
}));
