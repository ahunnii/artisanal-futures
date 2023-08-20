import { get } from "lodash";
import { create } from "zustand";

export type MonthlyCosts = {
  rent?: number;
  gas?: number;
  electric?: number;
  maintenance: number;
  cart?: {
    name: string;
    amount: number;
  }[];
};

export type MaterialCosts = {
  hours?: number;
  expenses?: {
    name: string;
    amount: number;
  }[];
};
interface useShopCalculatorProps {
  monthly: number;
  monthlyExpenses: MonthlyCosts;
  materials: number;
  materialExpenses: MaterialCosts;
  labor: number;

  setMonthly: (val: number) => void;

  setMonthlyExpenses: (val: MonthlyCosts) => void;
  setMaterials: (val: number) => void;
  setMaterialExpenses: (val: MaterialCosts) => void;
  setLabor: (val: number) => void;
}

export const useShopCalculator = create<useShopCalculatorProps>((set, get) => ({
  monthly: 0,
  materials: 0,
  labor: 0,
  materialExpenses: {
    hours: 0,
    expenses: [],
  },

  monthlyExpenses: {
    rent: 0,
    gas: 0,
    electric: 0,
    maintenance: 0,
    cart: [],
  },
  setMonthly: (val: number) => set({ monthly: val }),

  setMonthlyExpenses: (val: MonthlyCosts) => set({ monthlyExpenses: val }),
  setMaterialExpenses: (val: MaterialCosts) => set({ materialExpenses: val }),
  setMaterials: (val: number) => set({ materials: val }),
  setLabor: (val: number) => set({ labor: val }),
}));
