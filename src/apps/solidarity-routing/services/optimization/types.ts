export type Driver = {
  id: number | string;
  name: string;
  address?: Address;
  email: string;
  phone: string;
  schedule?: Schedule;
};

export type Client = {
  id: number;
  name: string;
  address?: Address;
  email?: string;
  phone?: string;
};

export type Address = {
  id: string;
  latitude: number;
  longitude: number;
  formatted: string;
  street?: string;
  additional?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
};

type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";

export type Schedule = Record<WeekDay, TimeSlot>;

type RouteDetails = {
  id: number | string;
  timeWindow: TimeSlot;
  startingLocation?: string;
  endingLocation?: string;
  numberOfStops: number;
  routeLength: number;
  unitMeasurement: "imperial" | "metric";
};

type StopType =
  | "start"
  | "break"
  | "pickup"
  | "delivery"
  | "end"
  | "detour"
  | "admin"
  | "misc";

type StopDetails = {
  id: number;
  arrivalTime: number;
  departureTime: number; //Estimated
  duration: number;
  prep: number;

  manifest?: string; //JSON on db perhaps
  details?: string;
};

type Stop = {
  id: number;
  type: StopType;
  client?: Client;
  details: StopDetails;
  address?: Address;
};

export type OptimizedRoute = {
  id: number | string;
  driver: Driver;
  details: RouteDetails;
  geoJson: unknown;
  breakSlots: TimeSlot[];
  route: Stop[];
};

type TimeSlot = {
  start: number;
  end: number;
};
