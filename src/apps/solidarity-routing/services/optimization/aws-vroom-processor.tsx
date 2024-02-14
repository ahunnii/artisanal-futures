import axios from "axios";
import { uniqueId } from "lodash";
import toast from "react-hot-toast";
import type { Polyline } from "../../types";
import type {
  ClientJobBundle,
  DriverVehicleBundle,
  OptimizedResponseData,
} from "../../types.wip";
import { formatGeometry } from "./aws-vroom/utils";
import type { OptimizationProcessor } from "./optimization-processor";

type VroomJob = {
  id: number;
  description: string;
  service: number;
  location: number[];
  skills: number[];
  priority: number;
  setup: number;
  time_windows: number[][];
};

type VroomVehicle = {
  id: number;
  profile: string;
  description: string;
  start: number[];
  end: number[];
  max_travel_time: number;
  max_tasks: number;
  capacity: number[];
  skills: number[];
  breaks: {
    time_windows: number[][];
    service: number;
    id: number;
  }[];
  time_window: number[];
};

type VroomData = {
  jobs: VroomJob[];
  vehicles: VroomVehicle[];
  options: {
    g: boolean;
  };
};

export type VroomGeometry = {
  properties: {
    color: number;
  };
  type: string;
  coordinates: [number, number][];
};

type VroomSummaryData = {
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

type VroomUnassignedData = {
  id: number;
  location: [number, number];
  description: string;
  type: string;
};

type VroomStepData = {
  arrival: number;
  distance: number;
  duration: number;
  load: number[];
  location: [number, number];
  service: number;
  setup: number;
  type: "job" | "pickup" | "delivery" | "shipment" | "break" | "start" | "end";
  violations: unknown[];
  waiting_time: number;
  description: string;
  id?: number;
  job?: number;
};

type VroomRouteData = {
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
  steps: VroomStepData[];
};

type VroomOptimizationData = {
  code: number;
  routes: VroomRouteData[];
  summary: VroomSummaryData;
  unassigned: VroomUnassignedData[];
};

type VroomOptimalPaths = { geometry: Polyline[]; data: VroomOptimizationData };

const OPTIMIZATION_ENDPOINT =
  "https://data.artisanalfutures.org/api/v1/optimization";

export const awsVroomProcessor: OptimizationProcessor<
  VroomData,
  VroomOptimalPaths,
  VroomVehicle,
  VroomJob,
  VroomOptimizationData
> = {
  async calculateOptimalPaths(params: VroomData): Promise<VroomOptimalPaths> {
    const { data }: { data: VroomOptimizationData } = await axios.post(
      OPTIMIZATION_ENDPOINT,
      params
    );

    console.log(data);

    // TODO Swap out with notification service
    if (!data) {
      toast.error(
        "There seems to be an issue connecting to API. Please try again later.."
      );
      throw new Error("Could not get routes. Please try again later..");
    } else {
      toast.success("Successfully created a solution");
    }

    const geometry: Polyline[] = formatGeometry(data);

    return {
      geometry,
      data,
    };
  },

  formatDriverData(data: DriverVehicleBundle[]): VroomVehicle[] {
    const convertDriverToVehicle = (bundle: DriverVehicleBundle) => {
      return {
        id: parseInt(uniqueId()),
        profile: "car",
        description: bundle.vehicle.id ?? "",
        start: [
          bundle.vehicle.startAddress.longitude,
          bundle.vehicle.startAddress.latitude,
        ],
        end: [
          bundle.vehicle.startAddress.longitude,
          bundle.vehicle.startAddress.latitude,
        ],
        max_travel_time: bundle.vehicle.maxTravelTime ?? 10800,

        max_tasks: bundle.vehicle.maxTasks ?? 100,
        capacity: [250],
        skills: [1],
        breaks: bundle.vehicle.breaks?.map((tw) => ({
          id: tw.id,
          service: tw.duration,
          time_windows: [[bundle.vehicle.shiftStart, bundle.vehicle.shiftEnd]],
        })) ?? [
          {
            id: 1,
            service: 1800,
            time_windows: [
              [bundle.vehicle.shiftStart, bundle.vehicle.shiftEnd],
            ],
          },
        ],
        time_window: [bundle.vehicle.shiftStart, bundle.vehicle.shiftEnd],
      };
    };
    return data.map(convertDriverToVehicle);
  },

  formatClientData(data: ClientJobBundle[]): VroomJob[] {
    const convertClientToJob = (bundle: ClientJobBundle) => {
      return {
        id: parseInt(uniqueId()),
        description: bundle.job.id ?? "",
        service: bundle.job.serviceTime ?? 1800,
        location: [bundle.job.address.longitude, bundle.job.address.latitude],
        skills: [1],
        priority: bundle.job.priority ?? 1,
        setup: bundle.job.prepTime ?? 0,
        time_windows: [[bundle.job.timeWindowStart, bundle.job.timeWindowEnd]],
      };
    };
    return data.map(convertClientToJob);
  },

  formatResponseData(data: VroomOptimizationData): OptimizedResponseData {
    const convertVroomResponseToOptimized: OptimizedResponseData = {
      summary: {
        totalDistance: data.summary.distance,
        totalDuration: data.summary.duration,
        totalPrepTime: data.summary.setup,
        totalServiceTime: data.summary.service,
        unassigned: data.unassigned.map((route) => route.description),
      },
      routes: data.routes.map((route: VroomRouteData) => ({
        vehicleId: route.description,
        geometry: route.geometry,
        totalDistance: route.distance,
        totalDuration: route.duration,
        totalPrepTime: route.setup,
        totalServiceTime: route.service,
        startTime: route.steps[0]?.arrival ?? 0,
        endTime: route.steps[route.steps.length - 1]?.arrival ?? 0,
        stops: route.steps.map((step) => ({
          jobId: step.description,
          arrival: step.arrival,
          departure:
            step.arrival +
            ((step?.service ?? 0) +
              (step?.setup ?? 0) +
              (step?.waiting_time ?? 0)),
          serviceTime: step?.service ?? 0,
          prepTime: step?.setup ?? 0,
          type: step?.type,
        })),
      })),
    };
    return convertVroomResponseToOptimized;
  },
};
