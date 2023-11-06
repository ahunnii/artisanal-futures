import { create } from "zustand";

interface useDriverSheetStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  isViewOnly: boolean;
  setIsViewOnly: (isViewOnly: boolean) => void;
  setIsOpen: (isOpen: boolean) => void;
}

export const useDriverSheet = create<useDriverSheetStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
  isViewOnly: false,
  setIsViewOnly: (isViewOnly) => set({ isViewOnly }),
  setIsOpen: (isOpen) => set({ isOpen }),
}));
