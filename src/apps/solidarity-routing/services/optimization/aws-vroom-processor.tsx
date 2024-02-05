import axios from "axios";
import { uniqueId } from "lodash";
import toast from "react-hot-toast";
import type { OptimizationData, Polyline } from "../../types";
import type { ClientJobBundle, DriverVehicleBundle } from "../../types.wip";
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

type VroomOptimalPaths = { geometry: Polyline[]; data: OptimizationData };
const OPTIMIZATION_ENDPOINT =
  "https://data.artisanalfutures.org/api/v1/optimization";

export const awsVroomProcessor: OptimizationProcessor<
  VroomData,
  VroomOptimalPaths,
  VroomVehicle,
  VroomJob
> = {
  async calculateOptimalPaths(params: VroomData): Promise<VroomOptimalPaths> {
    const { data }: { data: OptimizationData } = await axios.post(
      OPTIMIZATION_ENDPOINT,
      params
    );

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
        description: JSON.stringify({
          vehicleId: bundle.vehicle.id ?? null,
          driverId: bundle.driver.id ?? null,
        }),
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
        description: JSON.stringify({
          clientId: bundle.client.id ?? null,
          jobId: bundle.job.id ?? null,
        }),
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
};
