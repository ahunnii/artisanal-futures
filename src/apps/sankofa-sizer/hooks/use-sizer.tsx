import { create } from "zustand";
import { DEFAULT_BODY_PARTS } from "../data/body-parts";
import type { BodyPart, BodyParts, Part } from "../types";

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
  bodyParts: DEFAULT_BODY_PARTS,
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
