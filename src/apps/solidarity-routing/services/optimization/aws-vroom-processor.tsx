import axios from "axios";
import { uniqueId } from "lodash";
import toast from "react-hot-toast";
import { OptimizationData, Polyline } from "../../types";
import { formatGeometry } from "./aws-vroom/utils";
import { OptimizationProcessor } from "./optimization-processor";
import type { OptimizedRoute } from "./types";

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
  VroomOptimalPaths
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
};
