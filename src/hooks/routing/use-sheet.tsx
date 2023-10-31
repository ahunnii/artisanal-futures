import { create } from "zustand";

interface useSheetStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isViewOnly: boolean;
  setIsViewOnly: (isViewOnly: boolean) => void;
}

export const useSheet = create<useSheetStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isViewOnly: false,
  setIsViewOnly: (isViewOnly) => set({ isViewOnly }),
}));
