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
    metric: string;
    cost: number;
    amountUsed: number;
  }[];
};

export type LaborCosts = {
  hours: number;
  rate: number;
};
interface useShopCalculatorProps {
  monthly: number;
  monthlyExpenses: MonthlyCosts;
  materials: number;
  materialExpenses: MaterialCosts;
  labor: number;
  laborExpenses: LaborCosts;

  setMonthly: (val: number) => void;

  setMonthlyExpenses: (val: MonthlyCosts) => void;
  setMaterials: (val: number) => void;
  setMaterialExpenses: (val: MaterialCosts) => void;
  setLabor: (val: number) => void;
  setLaborExpenses: (val: LaborCosts) => void;
}

export const useShopCalculator = create<useShopCalculatorProps>((set) => ({
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

  laborExpenses: {
    hours: 0,
    rate: 0,
  },
  setMonthly: (val: number) => set({ monthly: val }),

  setMonthlyExpenses: (val: MonthlyCosts) => set({ monthlyExpenses: val }),
  setMaterialExpenses: (val: MaterialCosts) => set({ materialExpenses: val }),
  setLaborExpenses: (val: LaborCosts) => set({ laborExpenses: val }),
  setMaterials: (val: number) => set({ materials: val }),
  setLabor: (val: number) => set({ labor: val }),
}));
