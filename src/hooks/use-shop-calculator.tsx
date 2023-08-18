import { get } from "lodash";
import { create } from "zustand";

interface useShopCalculatorProps {
  monthly: number;
  materials: number;
  labor: number;
  setMonthly: (val: number) => void;
  setMaterials: (val: number) => void;
  setLabor: (val: number) => void;
  getTotal: () => number;
}

export const useShopCalculator = create<useShopCalculatorProps>((set, get) => ({
  monthly: 0,
  materials: 0,
  labor: 0,
  setMonthly: (val: number) => set({ monthly: val }),
  setMaterials: (val: number) => set({ materials: val }),
  setLabor: (val: number) => set({ labor: val }),
  getTotal: () => get().monthly + get().materials + get().labor,
}));
