import type { LatLngExpression, Map as LeafletMap } from "leaflet";
import { create } from "zustand";
interface useMapRefStore {
  mapRef: LeafletMap | null;
  setMapRef: (mapRef: LeafletMap | null) => void;
}

export const useMapRef = create<useMapRefStore>((set) => ({
  mapRef: null,
  setMapRef: (mapRef) => set({ mapRef }),
}));
