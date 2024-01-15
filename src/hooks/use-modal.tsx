import { create } from "zustand";

interface useModalShop {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useModal = create<useModalShop>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
