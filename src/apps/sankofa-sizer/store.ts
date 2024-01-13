import { create } from "zustand";

type Point = {
  x: number;
  y: number;
};
export type Part =
  | "shoulderToWrist"
  | "bicep"
  | "wrist"
  | "ankle"
  | "inseam"
  | "knee"
  | "seatBack";
export type BodyPart = {
  name: string;
  location: Point;
  virtual_length: number;
  actual_length: number;
  isEnabled: boolean;
  type: "vertical" | "horizontal";
};

type BodyParts = Record<string, BodyPart>;

type SizerState = {
  actual_pattern: {
    blob: string | null;
    width: number | null;
    height: number | null;
  };

  collectedMeasurements: {
    height: number;
    weight: number;
    gender: "male" | "female";
    system: "metric" | "imperial";
  };

  pixels_per_inch: number;
  toggle_overlay: string | null;

  bodyParts: BodyParts;
  updateBodyPart: (key: Part, bodyPart: BodyPart) => void;
  updateValue: (key: string, value: unknown) => void;
  toggleBodyPart: (partKey: Part) => void;
};

const defaultBodyParts: BodyParts = {
  shoulderToWrist: {
    name: "Shoulder to wrist (arm)",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 21, // inches
    actual_length: 21,
    isEnabled: false,
    type: "vertical",
  },
  bicep: {
    name: "Biceps",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 16, // inches
    actual_length: 16,
    isEnabled: false,
    type: "horizontal",
  },
  wrist: {
    name: "Wrist width",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 8, // inches
    actual_length: 8,
    isEnabled: false,
    type: "horizontal",
  },
  ankle: {
    name: "Ankle width",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 16, // inches
    actual_length: 16,
    isEnabled: false,
    type: "horizontal",
  },
  inseam: {
    name: "Inseam",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 21, // inches
    actual_length: 21,
    isEnabled: false,
    type: "vertical",
  },
  knee: {
    name: "Knee width",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 16, // inches
    actual_length: 16,
    isEnabled: false,
    type: "horizontal",
  },
  seatBack: {
    name: "Seat back",
    location: {
      x: 0,
      y: 0,
    },
    virtual_length: 16, // inches
    actual_length: 16,
    isEnabled: false,
    type: "horizontal",
  },
};

export const useSizerStore = create<SizerState>((set) => ({
  actual_pattern: {
    blob: null,
    width: null,
    height: null,
  },

  collectedMeasurements: {
    height: 1.83,
    weight: 87,
    gender: "female",
    system: "metric",
  },

  pixels_per_inch: 12,
  toggle_overlay: null,
  bodyParts: defaultBodyParts,
  updateBodyPart: (key, bodyPart) => {
    set((state) => {
      return {
        bodyParts: {
          ...state.bodyParts,
          [key]: bodyPart,
        },
      };
    });
  },

  updateValue: (key, value) => set({ [key]: value }),

  toggleBodyPart: (partKey) => {
    set((state) => {
      const currentBodyPart = state.bodyParts[partKey];
      if (!currentBodyPart) return {};

      return {
        bodyParts: {
          ...state.bodyParts,
          [partKey]: {
            ...currentBodyPart,
            isEnabled: !currentBodyPart.isEnabled,
          },
        },
      };
    });
  },
}));
