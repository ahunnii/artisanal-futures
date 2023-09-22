import type { User } from "@prisma/client";
import type { NextPage } from "next/types";

type AccountData = {
  username: string;
  email: string;
  first_name: string;
  last_name: string;

  moderated_forum: boolean;
  unmoderated_forum: boolean;
  hidden_forum: boolean;
  private_forum: boolean;

  about_me: string;
  profile_image_file: unknown;
  profile_image_url: string;
  profile_image_media_id: number | null;
  supply_chain: boolean;
};

type NewUser = {
  username: string;
  password: string;
  email: string;
  access_code: string;
};

type ReturningUser = {
  username: string;
  password: string;
};

type ArtisanACF = {
  acf: unknown;
  slug: string;
};

type Assessment = {
  type: string;
  version: number;
  description: string;
  data: string;
  data_reference: string;
  extra: string;
};
type Product = {
  name: string;
  description: string;
  principles: string;
  the_artisan: string;
  url: string;
  image: string;
  craftID: string;
  assessment: Assessment[];
  id: number;
};

type Attribute = string;

type Artisan = string;

type FilterData = {
  searchTerm: string;
  tags: string[] | FormDataEntryValue[];
};

type CurrentUser = {
  token: string;
  user_nicename: string;
};
type BusinessData = {
  biz_name: string;
  biz_description: string;
  website: string;
  location: string;
  biz_email: string;
  phone: string;

  biz_processes: string;
  biz_materials: string;
  biz_principles: string;

  listing_image_file: unknown;
  listing_image_url: string;
  listing_image_media_id: number | null;
};
type AdminData = {
  slug: string;
  membership_id: number;
  user_id: number;
  first_time_setup: boolean;
  full_name: string;
};

type FormattedData = AdminData & AccountData & BusinessData;

export type {
  AccountData,
  Artisan,
  ArtisanACF,
  Attribute,
  BusinessData,
  CurrentUser,
  FilterData,
  FormattedData,
  NewUser,
  Product,
  ReturningUser,
};

interface Shop {
  id: string;
  owner_name: string;
  business_name: string;
  website?: string;
  cover_photo?: string;
}

interface Profile {
  id: string;
  owner_name: string;
  business_name: string;
  website?: string;
  profile_photo?: string;
  bio?: string;
}

export type { Profile, Shop };

// Routing

export interface Coordinates {
  latitude: number | string;
  longitude: number | string;
}

export type TimeWindow = { startTime: string; endTime: string };

export type Break = {
  id: number;
  time_windows: TimeWindow[];
  service: number;
  description?: string;
  max_load?: number[];
};
export interface Driver {
  id: number;
  name: string;
  address: string;
  coordinates: Coordinates | null;
  time_window: TimeWindow;
  max_travel_time: number;
  max_stops: number;
  break_slots: Break[];
}

export interface Location {
  id: number;
  address: string;
  customer_name?: string;
  coordinates?: Coordinates | null;
  drop_off_duration: number;
  priority: number;
  time_windows: TimeWindow[];
}

export type TableData = {
  title: string;
  subTitle: string;
  columns: string[];
  dataKey: string;
  populationData: unknown;
};
export type Step = {
  id?: number;
  service?: number;
  waiting_time?: number;
  job?: number | null;
  type?: string;
  location: Coordinates;
  load?: number[];
  arrival: number;
  duration: number;
  distance?: number;
  geometry?: string;
};
export type Route = {
  vehicle: number;
  cost: number;
  delivery: number[];
  amount: number[];
  pickup: number[];
  service: number;
  duration: number;
  waiting_time: number;
  distance: number;
  steps: Step[];
  geometry: string;
};
export type Data = {
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
  unassigned: unknown[];
  routes: Route[];
};

export interface VehicleInfo {
  vehicle: number;
  description?: string;
  steps: Step[];
  geometry: string;
}

export type VehicleResponseData = {
  name: string;
  address: string;
  coordinates: Coordinates;
  time_window: TimeWindow;
  max_travel_time: number;
  max_stops: number;
  break_slots: Break[];
  id: number;
};

export type CustomerResponseData = {
  customer_name: string;
  address: string;
  coordinates: Coordinates;
  drop_off_duration: number;
  priority: number;
  time_windows: TimeWindow[];
  id: number;
};

export type StopCSVData = {
  customer_name: string;
  address: string;

  latitude: number;
  longitude: number;

  drop_off_duration: number;
  priority: number;
  time_windows: string;
  id: number;
};

export type DriverCSVData = {
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  time_window: string;
  max_travel_time: number;
  max_stops: number;
  break_slots: string;
  id: number;
};

export type GeoJsonData = {
  coordinates: number[][];
  properties: {
    color: string;
  };
  type:
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection"
    | "Feature"
    | "FeatureCollection";
};

export type GeoJsonDataAdvanced = {
  coordinates: number[][];
  properties: {
    color: string;
  };
  type:
    | "Point"
    | "MultiPoint"
    | "LineString"
    | "MultiLineString"
    | "Polygon"
    | "MultiPolygon"
    | "GeometryCollection"
    | "Feature"
    | "FeatureCollection";
};

export type CalculatedStep = {
  type: string; // or you could be more specific: type: "start" | "job" | "break" | "end";
  location?: [number, number][];
  setup: number;
  service: number;
  waiting_time: number;
  load: number[];
  arrival: number;
  duration: number;
  violations: unknown[]; // Depending on the actual structure of violations you might want to define a more specific type
  distance: number;

  // Additional fields for different types
  description?: string;
  id?: number;
  job?: number;
  location_index?: number;
};

export type CalculatedVehicleData = {
  vehicle: number;
  cost: number;
  description: string;
  delivery: number[];
  amount: number[];
  pickup: number[];
  setup: number;
  service: number;
  duration: number;
  waiting_time: number;
  priority: number;
  distance: number;
  steps: CalculatedStep[];
  violations: unknown[]; // Again, you might want to define a specific type for violations
  geometry: string;
};

export type LatLngBounds = {
  southWest: {
    lat: number;
    lng: number;
  };
  northEast: {
    lat: number;
    lng: number;
  };
};
type Geometry = {
  type: string;
  coordinates: Coordinates[];
};
export interface Result {
  geometry: Geometry[];
  data: Data;
}

// Artisanal Futures Forum

export type Author = Pick<User, "id" | "name" | "image">;
export type NextPageWithAuthAndLayout = NextPage & {
  auth?: boolean;
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};
