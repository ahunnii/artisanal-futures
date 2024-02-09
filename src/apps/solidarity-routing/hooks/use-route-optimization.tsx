import { useEffect, useState } from "react";
import type { RouteData } from "~/apps/solidarity-routing/types";

import toast from "react-hot-toast";
import { getUniqueKey } from "~/apps/solidarity-routing/libs/unique-key";

import optimizationService from "../services/optimization";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";

import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { api } from "~/utils/api";
import { OptimizationPlan } from "../types.wip";
import { useClientJobBundles } from "./jobs/use-client-job-bundles";
import { useRoutingSolutions } from "./use-routing-solutions";

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
  const driverBundles = useDriverVehicleBundles();
  const jobBundles = useClientJobBundles();
  const apiContext = api.useContext();
  const router = useRouter();
  const { routeId } = router.query;
  const { data: session } = useSession();

  const setOptimizedData = api.routePlan.setOptimizedDataWithVroom.useMutation({
    onSuccess: () => {
      toast.success("Optimized data has been saved");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Error saving optimized data");
    },
    onSettled: () => {
      void apiContext.routePlan.invalidate();
    },
  });

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
    const jobs = optimizationService.formatClientData(jobBundles.data);
    const vehicles = optimizationService.formatDriverData(driverBundles.data);

    const uniqueKey = await getUniqueKey({
      locations: jobBundles.data,
      drivers: driverBundles.data,
    });

    console.log(uniqueKey);

    const params = {
      jobs,
      vehicles,
      options: {
        g: true,
      },
    };

    const results = await optimizationService.calculateOptimalPaths(params);

    // if (results && session?.user && routeId) {
    //   setOptimizedData.mutate({
    //     routeId: routeId as string,
    //     data: JSON.stringify(results),
    //   });
    // }

    setRoutingSolutions(uniqueKey, results);

    setOptimizedData.mutate({
      routeId: routeId as string,
      plan: results as OptimizationPlan,
    });

    return results;
  };

  const fetchRoutes = async () => {
    const uniqueKey = await getUniqueKey({
      locations: jobBundles.data,
      drivers: driverBundles.data,
    });

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
  }, [
    routingSolutions,
    driverBundles.data,
    jobBundles.data,
    currentRoutingSolution,
  ]);

  useEffect(() => {
    setCurrentRoutingSolution(null);
  }, [driverBundles.data, jobBundles.data, setCurrentRoutingSolution]);

  return {
    filteredLocations,

    getRoutes: async () => {
      const data = await fetchRoutes();
      setCurrentRoutingSolution(data!);

      console.log(data);
      return data;
    },
    currentRoutingSolution,
  };
};

export default useRouteOptimization;
