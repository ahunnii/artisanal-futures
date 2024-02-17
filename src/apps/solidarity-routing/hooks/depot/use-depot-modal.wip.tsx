import { create } from "zustand";

interface useDepotModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useDepotModal = create<useDepotModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
