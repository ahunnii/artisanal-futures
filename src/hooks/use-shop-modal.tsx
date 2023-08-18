import { create } from "zustand";

interface useShopModalShop {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useShopModal = create<useShopModalShop>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
