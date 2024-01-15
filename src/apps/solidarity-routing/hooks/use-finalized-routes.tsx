import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { ExpandedRouteData } from "~/apps/solidarity-routing/types";

export interface useDepotStore {
  routes: ExpandedRouteData[];
  selectedRoute: ExpandedRouteData | null;
  setRoutes: (routes: ExpandedRouteData[]) => void;
  updateRoute: (route: ExpandedRouteData) => void;
  setSelectedRoute: (route: ExpandedRouteData | null) => void;
}

export const useFinalizedRoutes = create<useDepotStore>()(
  persist(
    (set) => ({
      routes: [],
      selectedRoute: null,
      setSelectedRoute: (selectedRoute) => set({ selectedRoute }),
      setRoutes: (routes) => set({ routes }),
      updateRoute: (current) =>
        set((state) => ({
          routes: state.routes.map((step) =>
            step.routeId === current.routeId ? { ...step, ...current } : step
          ),
        })),
    }),
    {
      name: "finalized-storage", // name of item in the storage (must be unique)
      storage: createJSONStorage(() => sessionStorage), // (optional) by default the 'localStorage' is used
      partialize: (state) => ({ routes: state.routes }),
      skipHydration: true,
    }
  )
);
