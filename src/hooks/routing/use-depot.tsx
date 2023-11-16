import { uniqueId } from "lodash";
import { create } from "zustand";
import type {
  ExpandedRouteData,
  ExtendedStepData,
} from "~/components/tools/routing/types";

export interface useDepotStore {
  routes: ExpandedRouteData[];
  selectedRoute: ExpandedRouteData | null;
  setRoutes: (routes: ExpandedRouteData[]) => void;
  updateRoute: (route: ExpandedRouteData) => void;
  setSelectedRoute: (route: ExpandedRouteData | null) => void;
}

export const useDepot = create<useDepotStore>((set) => ({
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
}));
