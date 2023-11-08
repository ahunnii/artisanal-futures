import { create } from "zustand";

interface useDepotModalShop {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useDepotModal = create<useDepotModalShop>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
