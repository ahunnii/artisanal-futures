import type { BodyParts } from "~/apps/sankofa-sizer/types";

export const DEFAULT_BODY_PARTS: BodyParts = {
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
