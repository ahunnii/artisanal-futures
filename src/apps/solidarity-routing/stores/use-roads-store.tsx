import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { v4 as uuidv4 } from 'uuid';
import type { RoadBundle } from "../types.wip";

interface useRoadsStore {
  roads: RoadBundle[];
  selectedRoads: RoadBundle[];
  activeRoad: RoadBundle | null;

  setActiveRoad: (
    activeRoadBundle: RoadBundle | null
  ) => void;
  setActiveRoadById: (activeRoadBundle2: string | null) => void;

  setRoads: (roadBundles: RoadBundle[]) => void;
  setSelectedRoads: (roadBundles: RoadBundle[]) => void;
  updateRoad: (id: string, data: Partial<RoadBundle>) => void;

  removeRoad: (id: string) => void;
  appendRoad: (roadBundle: RoadBundle) => void;
  addRoadByLatLng: (lat: number, lng: number, depotId: string) => void;

  isRoadSheetOpen: boolean;
  setIsRoadSheetOpen: (isOpen: boolean) => void;

  isRoadRoutePanelOpen: boolean;
  setIsRoadRoutePanelOpen: (isOpen: boolean) => void;

  isRoadMessagePanelOpen: boolean;
  setIsRoadMessagePanelOpen: (isOpen: boolean) => void;
}

export const useRoadsStore = create<useRoadsStore>()(
  persist(
    (set) => ({
      roads: [],
      selectedRoads: [],
      activeRoad: null,
      setActiveRoad: (activeRoad) => set({ activeRoad }),
      setActiveRoadById: (id) =>
        set((state) => ({
          activeRoad:
            state.roads.find((bundle) => bundle.id === id) ?? null,
        })),

      setRoads: (roads) => set({ roads }),
      setSelectedRoads: (selectedRoads) => set({ selectedRoads }),

      updateRoad: (id, data) =>
        set((state) => ({
          roads: state.roads.map((bundle) =>
            bundle.id === id ? { ...bundle, ...data } : bundle
          ),
        })),
      removeRoad: (id) =>
        set((state) => ({
          roads: state.roads.filter((bundle) => bundle.id !== id),
        })),
      appendRoad: (road) =>
        set((state) => ({ roads: [...state.roads, road] })),

      addRoadByLatLng: (lat, lng, depotId) =>
        set((state) => ({
          roads: [...state.roads, {
            id: uuidv4(),
            name: "Unnamed Road",
            points: [{
              id: uuidv4(),
              latitude: lat,
              longitude: lng,
              order: 0,
              roadId: "",
              createdAt: new Date(),
              updatedAt: new Date(),
            }],
            createdAt: new Date(),
            updatedAt: new Date(),
            depotId: depotId,
          }],
        })),

      isRoadSheetOpen: false,
      setIsRoadSheetOpen: (isRoadSheetOpen) => set({ isRoadSheetOpen }),

      isRoadRoutePanelOpen: false,
      setIsRoadRoutePanelOpen: (isRoadRoutePanelOpen) =>
        set({ isRoadRoutePanelOpen }),

      isRoadMessagePanelOpen: false,
      setIsRoadMessagePanelOpen: (isRoadMessagePanelOpen) =>
        set({ isRoadMessagePanelOpen }),
    }),
    {
      name: "road-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ roads: state.roads }),
      skipHydration: true,
    }
  )
);
