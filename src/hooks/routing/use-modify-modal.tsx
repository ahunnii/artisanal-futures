import { create } from "zustand";

interface useModifyModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useModifyModal = create<useModifyModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
