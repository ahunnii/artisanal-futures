export type Point = {
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

export type BodyParts = Record<string, BodyPart>;
