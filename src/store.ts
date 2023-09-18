import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  CustomerResponseData,
  Driver,
  Location,
  Route,
  VehicleResponseData,
} from "~/types";
interface LocationTableRow {
  address: string;
  duration: number;
  timeWindow: any[];
  priority: string;
}
type TimeWindow = [number, number];
type Coordinates = [number, number];
type Geometry = {
  type: string;
  coordinates: Coordinates[];
};

type Step = {
  id?: number;
  service?: number;
  waiting_time?: number;
  job?: number;
  type: string;
  location: Coordinates;
  load: number[];
  arrival: number;
  duration: number;
  distance: number;
};
// type Route = {
//   vehicle: number;
//   cost: number;
//   delivery: number[];
//   amount: number[];
//   pickup: number[];
//   service: number;
//   duration: number;
//   waiting_time: number;
//   distance: number;
//   steps: Step[];
//   geometry: string;
// };
type Data = {
  code: number;
  summary: {
    cost: number;
    unassigned: number;
    delivery: number[];
    amount: number[];
    pickup: number[];
    service: number;
    duration: number;
    waiting_time: number;
    distance: number;
    computing_times: {
      loading: number;
      solving: number;
      routing: number;
    };
  };
  unassigned: any[];
  routes: Route[];
};
interface Result {
  geometry: Geometry[];
  data: Data;
}
interface RouteState {
  locations: CustomerResponseData[];
  drivers: VehicleResponseData[];
  pinType: string;
  setPinType: (pinType: string) => void;

  setLocations: (locations: Location[]) => void;
  updateLocation: (id: number, data: Partial<Location>) => void;
  updateDriver: (id: number, data: Partial<Driver>) => void;
  removeLocation: (id: number) => void;
  removeDriver: (id: number) => void;
  setDrivers: (drivers: Driver[]) => void;
  appendLocation: (location: Location) => void;
  appendDriver: (driver: Driver) => void;
  [key: string]: any;
  setData: <T>(arrName: string, data: T) => void;
}

interface RequestState {
  cachedDirections: Map<string, any>;
  cachedIsochrones: Map<string, any>;
  cachedOptimizations: Map<string, any>;
  optimization: Result | null;
  setOptimization: (optimization: any) => void;
  setMap: <T>(mapName: string, cachedRequests: Map<string, T>) => void;
  appendMap: <T>(mapName: string, address: string, response: T) => void;
  [key: string]: any;
}

interface LocationTableState {
  rows: LocationTableRow[];
  setRows: (rows: LocationTableRow[]) => void;
}
interface MenuStore {
  menuPosition: { x: number; y: number } | null;
  showMenu: boolean;
  activeItem: number | null;
  activeDriver: number | null;
  openMenu: (position: { x: number; y: number }) => void;
  closeMenu: () => void;
  setActiveItem: (data: number | null) => void;
  setActiveDriver: (data: number | null) => void;
}

export const useMenuStore = create<MenuStore>((set) => ({
  menuPosition: null,
  activeItem: 0,
  showMenu: false,
  activeDriver: 0,
  openMenu: (position) => set({ showMenu: true, menuPosition: position }),
  closeMenu: () => set({ showMenu: false, menuPosition: null }),
  setActiveItem: (data) => set({ activeItem: data }),
  setActiveDriver: (data) => set({ activeDriver: data }),
}));

export const useRouteStore = create<RouteState>()((set) => ({
  locations: [],
  drivers: [],
  pinType: "location",
  setPinType: (type) => set({ pinType: type }),
  setLocations: (locations) => set({ locations }),

  updateLocation: (id, data) =>
    set((state) => ({
      locations: state.locations.map((location) =>
        location.id === id ? { ...location, ...data } : location
      ),
    })),
  updateDriver: (id, data) =>
    set((state) => ({
      drivers: state.drivers.map((driver) =>
        driver.id === id ? { ...driver, ...data } : driver
      ),
    })),
  removeLocation: (id) =>
    set((state) => ({
      locations: state.locations.filter((location) => location.id !== id),
    })),
  setDrivers: (drivers) => set({ drivers }),
  appendLocation: (location) =>
    set((state) => ({ locations: [...state.locations, location] })),
  appendDriver: (driver) =>
    set((state) => ({ drivers: [...state.drivers, driver] })),
  setData: <T>(arrName: string, data: T) => set({ [arrName]: data }),
  appendData: <T>(arrName: string, data: T) =>
    set((state) => ({ [arrName]: [...state[arrName], data] })),
  removeDriver: (id) =>
    set((state) => ({
      drivers: state.drivers.filter((driver) => driver.id !== id),
    })),
}));

export const useRequestStore = create<RequestState>((set) => ({
  cachedDirections: new Map<string, any>(),
  cachedIsochrones: new Map<string, any>(),
  cachedOptimizations: new Map<string, any>(),
  optimization: null,
  setOptimization: (optimization) => set({ optimization }),
  setMap: <T>(mapName: string, cachedRequests: Map<string, T>) =>
    set({ [mapName]: cachedRequests }),
  appendMap: <T>(mapName: string, address: string, response: T) =>
    set((state) => ({
      [mapName]: new Map([
        ...(state[mapName as keyof RequestState] || []),
        [address, response],
      ]),
    })),
}));

export const useTableStore = create<LocationTableState>((set) => ({
  rows: [],
  setRows: (rows) => set({ rows }),
}));

// Sankofa Sizer

// Define the state type

export type Part = {
  name: string;
  id: number;
  x: number;
  y: number;
  lineX: number;
  lineY: number;
  virtual_length: number;
  actual_length: number;
  selected: boolean;
  type: "vertical" | "horizontal";
};
type SizerState = {
  actual_pattern: {
    blob: unknown;
    width: number | null;
    height: number | null;
  };
  show_popup_pattern: boolean;
  pixels_per_inch: number;
  toggle_overlay: string | null;
  box_to_checkbox: {
    bodyPart: string | null;
    toggle: boolean;
  };
  add_image_toggle: boolean;
  parts: Part[];
  updateParts: (lengthUpdates: Part[] | Partial<Part>[]) => void;
  addModifiedParts: (lengthUpdates: Part[] | Partial<Part>[]) => void;
  updateValue: (key: string, value: unknown) => void;
};

export const useSizerStore = create<SizerState>((set) => ({
  actual_pattern: {
    blob: null,
    width: null,
    height: null,
  },
  show_popup_pattern: false,
  pixels_per_inch: 12,
  toggle_overlay: null,
  box_to_checkbox: {
    bodyPart: null,
    toggle: false,
  },
  add_image_toggle: false,
  parts: [
    {
      name: "Shoulder to wrist (arm)",
      id: 1,
      x: 0,
      y: 0,
      lineX: 0,
      lineY: 0,
      virtual_length: 21, // inches
      actual_length: 21,
      selected: false,
      type: "vertical",
    },
    {
      name: "Biceps",
      id: 2,
      x: 0,
      y: 0,
      lineX: 0,
      lineY: 0,
      virtual_length: 16, // inches
      actual_length: 16,
      selected: false,
      type: "horizontal",
    },
    {
      name: "Wrist width",
      id: 3,
      x: 0,
      y: 0,
      lineX: 0,
      lineY: 0,
      virtual_length: 8, // inches
      actual_length: 8,
      selected: false,
      type: "horizontal",
    },
  ],

  updateParts: (lengthUpdates) => {
    set((state) => {
      if (state.parts && state.parts.length > 0)
        for (let i = 0; i < lengthUpdates.length; i++) {
          state.parts[i].virtual_length = lengthUpdates[i]["length"];
          state.parts[i].actual_length = lengthUpdates[i]["length"];
        }
      return { parts: state.parts };
    });
  },
  addModifiedParts: (lengthUpdates) => {
    set((state) => {
      const modifiedParts = state.parts.map((part, index) => ({
        ...part,
        name: `${part.name} (new)`,
        length: lengthUpdates[index].length,
      }));
      return { parts: [...state.parts, ...modifiedParts] };
    });
  },

  updateValue: (key, value) => set({ [key]: value }),
}));
