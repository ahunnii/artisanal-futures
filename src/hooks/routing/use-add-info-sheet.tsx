import { create } from "zustand";

interface useAddInfoSheetShop {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useAddInfoSheet = create<useAddInfoSheetShop>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
