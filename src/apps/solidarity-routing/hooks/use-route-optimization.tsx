import { useEffect, useState } from "react";
import type { RouteData } from "~/apps/solidarity-routing/types";

import toast from "react-hot-toast";
import { getUniqueKey } from "~/apps/solidarity-routing/libs/unique-key";

import optimizationService from "../services/optimization";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";

import { useClientJobBundles } from "./jobs/use-client-job-bundles";
import { useRoutingSolutions } from "./use-routing-solutions";
import { useStopsStore } from "./use-stops-store";

type FilteredLocation = {
  job_id: string;
  vehicle_id: string;
};

const mapJobsToVehicles = (routingSolution: Array<RouteData>) => {
  const result = [];
  for (const route of routingSolution) {
    const vehicleId = route.vehicle;
    for (const step of route.steps) {
      if (step.type === "job" && step.id !== undefined) {
        const jobId = step.id;
        result.push({ job_id: `${jobId}`, vehicle_id: `${vehicleId}` });
      }
    }
  }
  return result;
};

const useRouteOptimization = () => {
  const bundles = useDriverVehicleBundles();

  const drivers = bundles?.data;

  const { stops: locations } = useClientJobBundles();
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
    const jobs = optimizationService.formatClientData(locations);
    const vehicles = optimizationService.formatDriverData(drivers);

    const uniqueKey = await getUniqueKey({ locations, drivers });

    const params = {
      jobs,
      vehicles,
      options: {
        g: true,
      },
    };

    const results = await optimizationService.calculateOptimalPaths(params);

    setRoutingSolutions(uniqueKey, results);

    return results;
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
      setCurrentRoutingSolution(data!);

      return data;
    },
    currentRoutingSolution,
  };
};

export default useRouteOptimization;
