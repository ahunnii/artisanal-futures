import { uniqueId } from "lodash";
import { create } from "zustand";
import type { ExtendedStepData } from "~/components/tools/routing/types";

export interface useDriverRouteStore {
  stops: ExtendedStepData[];
  selectedStop: ExtendedStepData | null;
  setStops: (stops: ExtendedStepData[]) => void;
  updateStop: (stop: ExtendedStepData) => void;
  setSelectedStop: (stop: ExtendedStepData | null) => void;
}

export const useDriverRoute = create<useDriverRouteStore>((set) => ({
  stops: [],
  selectedStop: null,
  setSelectedStop: (selectedStop) => set({ selectedStop }),
  setStops: (stops) => set({ stops }),
  updateStop: (current) =>
    set((state) => ({
      stops: state.stops.map((step) =>
        step.id === current.id ? { ...step, ...current } : step
      ),
    })),
}));
