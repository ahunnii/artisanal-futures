import { create } from "zustand";
import type {
  OptimizationData,
  VroomResponse,
} from "~/components/tools/routing/types";

interface useSolutionsStore {
  currentRoutingSolution: VroomResponse | null;
  routingSolutions: Map<string, VroomResponse | null>;
  setCurrentRoutingSolution: (solution: VroomResponse | null) => void;
  setRoutingSolutions: (name: string, solutions: VroomResponse | null) => void;
}

export const useRoutingSolutions = create<useSolutionsStore>((set) => ({
  currentRoutingSolution: null,
  routingSolutions: new Map<string, VroomResponse>(),
  setCurrentRoutingSolution: (currentRoutingSolution) =>
    set({ currentRoutingSolution }),
  setRoutingSolutions: (name: string, solutions: VroomResponse | null) =>
    set((state) => {
      const updatedSolutions = new Map(state.routingSolutions);
      updatedSolutions.set(name, solutions);
      return { routingSolutions: updatedSolutions };
    }),
}));
