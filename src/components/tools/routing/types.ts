export type TimeWindow = {
  startTime: string;
  endTime: string;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

export type Break = {
  id: number;
  time_windows: TimeWindow[];
  service: number;
};
export type Driver = {
  id: number;
  name: string;
  address: string;
  time_window: TimeWindow;
  break_slots: Break[];
  coordinates: Coordinates;
  max_travel_time: number;
  max_stops: number;
  contact_info?: string;
  description?: string;
  email?: string;
  phone?: string;
  details?: string;
};

export type Stop = {
  id: number;
  customer_name: string;
  address: string;
  time_windows: TimeWindow[];
  coordinates: Coordinates;
  priority: number;
  drop_off_duration: number;
  prep_time_duration: number;
  email?: string;
  phone?: string;
  details?: string;
};

type SummaryData = {
  amount: number[];
  computing_times: {
    loading: number;
    solving: number;
    routing: number;
  };
  cost: number;
  delivery: number[];
  distance: number;
  duration: number;
  pickup: number[];
  priority: number;
  routes: number;
  service: number;
  setup: number;
  unassigned: number;
  violations: unknown[];
  waiting_time: number;
};

export type UnassignedData = {
  id: number;
  location: [number, number];
  description: string;
  type: string;
};

export type StepData = {
  arrival: number;
  distance: number;
  duration: number;
  load: number[];
  location: [number, number];
  service: number;
  setup: number;
  type: string;
  violations: unknown[];
  waiting_time: number;
  description?: string;
  id?: number;
  job?: number;
};
export type RouteData = {
  amount: number[];
  cost: number;
  delivery: number[];
  description: string;
  distance: number;
  duration: number;
  geometry: string;
  pickup: number[];
  priority: number;
  service: number;
  setup: number;
  vehicle: number;
  violations: unknown[];
  waiting_time: number;
  steps: StepData[];
};

export type OptimizationData = {
  code: number;
  routes: RouteData[];
  summary: SummaryData;
  unassigned: UnassignedData[];
};

export type Polyline = {
  type: string;
  coordinates: [number, number][];
  properties?: {
    color: number;
  };
};

export type VroomResponse = {
  geometry: Polyline[];
  data: OptimizationData;
};

export type GeoJsonData = {
  type:
    | "FeatureCollection"
    | "Feature"
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection";
  features: {
    type:
      | "FeatureCollection"
      | "Feature"
      | "Point"
      | "MultiPoint"
      | "LineString"
      | "MultiLineString"
      | "Polygon"
      | "MultiPolygon"
      | "GeometryCollection";
    geometry: Polyline;
  }[];
};

export interface ExpandedStepData extends StepData {
  status: "failed" | "success" | "pending" | "cancelled";
  notes?: string;
}

export interface ExpandedRouteData extends RouteData {
  steps: ExpandedStepData[];
}

export type PusherUserData = {
  userId: string;
  latitude: number;
  longitude: number;
  accuracy: number;
  removeUser?: boolean;
  fileId?: string;
  route: RouteData;
};
export type PusherMessage = {
  userId: string;
  name: string;
  deliveryNotes: string;
  address: string;
  status?: "success" | "failed" | "pending";
};

export type FileData = {
  customer_name: string;
  address: string;
  latitude: number;
  longitude: number;
  drop_off_duration: number;
  prep_time_duration: number;
  priority: number;
  time_windows: string;
  id: number;
  lat?: number;
};

export type ParsedStop = {
  name: string;
  address: string;
  duration: number;
  prep: number;
  priorityLevel: string;
  fulfillmentTimesFormatted: {
    startTime: string;
    endTime: string;
  }[];
  fulfillmentTimes: [number, number][];
  latitude: number;
  longitude: number;
};
