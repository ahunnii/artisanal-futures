import { create } from "zustand";

import type {
  Channel,
  DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";

interface MessageChannelStore {
  channels: Channel[];
  activeChannel: Channel | null;

  activeDriver: DriverVehicleBundle | null;
  setActiveDriver: (activeDriver: DriverVehicleBundle | null) => void;

  isDepot: boolean;
  setIsDepot: (isDepot: boolean) => void;

  setActiveChannel: (activeChanel: Channel | null) => void;
  setChannels: (channels: Channel[]) => void;

  isDriverMessagePanelOpen: boolean;
  setIsDriverMessagePanelOpen: (isOpen: boolean) => void;
}

export const useMessageChannelStore = create<MessageChannelStore>()((set) => ({
  channels: [],
  activeChannel: null,
  isDepot: false,
  activeDriver: null,

  setActiveDriver: (activeDriver) => set({ activeDriver }),

  setIsDepot: (isDepot) => set({ isDepot }),
  setActiveChannel: (activeChannel) => set({ activeChannel }),
  setChannels: (channels) => set({ channels }),

  isDriverMessagePanelOpen: false,
  setIsDriverMessagePanelOpen: (isDriverMessagePanelOpen) =>
    set({ isDriverMessagePanelOpen }),
}));
