import polyline from "@mapbox/polyline";
import axios from "axios";
import { useEffect, useState } from "react";
import type {
  OptimizationData,
  Polyline,
  RouteData,
  VroomResponse,
} from "~/apps/solidarity-routing/types";

import toast from "react-hot-toast";
import { getUniqueKey } from "~/apps/solidarity-routing/libs/unique-key";
import {
  convertDriverToVehicle,
  convertStopToJob,
} from "~/utils/routing/data-formatting";
import { useDrivers } from "./use-drivers";
import { useRoutingSolutions } from "./use-routing-solutions";
import { useStops } from "./use-stops";
type FilteredLocation = {
  job_id: number;
  vehicle_id: number;
};

const address = "https://data.artisanalfutures.org/api/v1/optimization";

const mapJobsToVehicles = (routingSolution: Array<RouteData>) => {
  const result = [];
  for (const route of routingSolution) {
    const vehicleId = route.vehicle;
    for (const step of route.steps) {
      if (step.type === "job" && step.id !== undefined) {
        const jobId = step.id;
        result.push({ job_id: jobId, vehicle_id: vehicleId });
      }
    }
  }
  return result;
};

const calculateGeometry = (data: OptimizationData) => {
  const initGeometry = data.routes.map((route: RouteData) => {
    return polyline.toGeoJSON(route?.geometry);
  });

  const colorizeGeometry = (initGeometry as Polyline[]).map(
    (route: Polyline, idx: number) => {
      return {
        ...route,
        properties: { color: data.routes[idx]!.vehicle },
      };
    }
  );

  return colorizeGeometry;
};

const useRouteOptimization = () => {
  const drivers = useDrivers((state) => state.drivers);
  const locations = useStops((state) => state.locations);
  const [filteredLocations, setFilteredLocations] = useState<
    FilteredLocation[]
  >([]);

  const {
    currentRoutingSolution,
    setCurrentRoutingSolution,
    setRoutingSolutions,
    routingSolutions,
  } = useRoutingSolutions();

  const calculateRoutes = async () => {
    const jobs = locations.map(convertStopToJob);
    const vehicles = drivers.map(convertDriverToVehicle);

    const uniqueKey = await getUniqueKey({ locations, drivers });

    const params = {
      jobs,
      vehicles,
      options: {
        g: true,
      },
    };

    console.log(params);

    const { data } = await axios.post(address, params);

    if (!data)
      throw new Error("Could not get routes. Please try again later..");

    const coloredGeometry = calculateGeometry(data as OptimizationData);

    toast.success("Successfully created a solution");

    setRoutingSolutions(uniqueKey, {
      geometry: coloredGeometry,
      data,
    });

    return {
      geometry: coloredGeometry,
      data,
    };
  };

  const fetchRoutes = async () => {
    const uniqueKey = await getUniqueKey({ locations, drivers });

    if (!routingSolutions.has(uniqueKey)) return calculateRoutes();

    toast.success("Retrieving solution from cache");
    return routingSolutions.get(uniqueKey);
  };

  //Update displayed geometry from optimization request
  useEffect(() => {
    setFilteredLocations([]);
    if (currentRoutingSolution) {
      setFilteredLocations(
        mapJobsToVehicles(currentRoutingSolution.data.routes)
      );
    }
  }, [routingSolutions, drivers, locations, currentRoutingSolution]);

  useEffect(() => {
    setCurrentRoutingSolution(null);
  }, [locations, drivers, setCurrentRoutingSolution]);

  return {
    filteredLocations,

    getRoutes: async () => {
      const data = await fetchRoutes();
      setCurrentRoutingSolution(data as VroomResponse);

      return data;
    },
    currentRoutingSolution,
  };
};

export default useRouteOptimization;
