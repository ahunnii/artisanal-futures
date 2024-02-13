import { useSession } from "next-auth/react";
import { useParams, usePathname, useRouter } from "next/navigation";
import { useMemo } from "react";
import toast from "react-hot-toast";
import { env } from "~/env.mjs";
import { api } from "~/utils/api";
import optimizationService from "../../services/optimization";
import { OptimizationPlan } from "../../types.wip";
import { getUniqueKey } from "../../utils/generic/unique-key";
import { useDriverVehicleBundles } from "../drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "../jobs/use-client-job-bundles";
import { useRoutingSolutions } from "./use-routing-solutions";

import * as crypto from "crypto";

function generatePasscode(email: string): string {
  // Create a SHA-256 hash
  const hash = crypto.createHash("sha256");
  // Update the hash with the email
  hash.update(email);
  // Get the hashed value as a hexadecimal string
  const hashedEmail = hash.digest("hex");
  // Take the first 6 characters of the hashed email
  const passcode = hashedEmail.substring(0, 6);
  return passcode;
}

export const useRoutePlans = () => {
  const apiContext = api.useContext();
  const { data: session } = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const driverBundles = useDriverVehicleBundles();
  const jobBundles = useClientJobBundles();

  const routingSolutions = useRoutingSolutions();

  const routeId = params?.routeId as string;
  const user = session?.user ?? null;
  const isSandbox = pathname?.includes("sandbox");
  const isUserAllowedToSaveToDepot = session?.user !== null && !isSandbox;

  const getRoutePlanById = api.routePlan.getRoutePlanById.useQuery(
    {
      id: params?.routeId as string,
    },
    {
      enabled: !!params?.routeId,
    }
  );

  const route = getRoutePlanById?.data;

  const unassignedJobs = jobBundles.data?.filter(
    (bundle) => !bundle.job.isOptimized
  );

  const assignedJobs = jobBundles.data?.filter(
    (bundle) => bundle.job.isOptimized
  );

  const setOptimizedData = api.routePlan.setOptimizedDataWithVroom.useMutation({
    onSuccess: () => {
      toast.success("Optimized data has been saved");
    },
    onError: (error: unknown) => {
      console.log(error);
      toast.error("Error saving optimized data");
    },
    onSettled: () => {
      void apiContext.routePlan.invalidate();
    },
  });

  const calculateRoutes = async () => {
    const jobs = optimizationService.formatClientData(jobBundles.data);
    const vehicles = optimizationService.formatDriverData(driverBundles.data);

    const params = {
      jobs,
      vehicles,
      options: {
        g: true,
      },
    };

    const results = await optimizationService.calculateOptimalPaths(params);

    if (isUserAllowedToSaveToDepot) {
      setOptimizedData.mutate({
        routeId,
        plan: results as OptimizationPlan,
      });
    } else {
      const uniqueKey = await getUniqueKey({
        locations: jobBundles.data,
        drivers: driverBundles.data,
      });

      routingSolutions.setRoutingSolutions(uniqueKey, results);
    }
  };

  const jobVehicleBundles = useMemo(() => {
    if (!route || !route.optimizedRoute || route?.optimizedRoute?.length === 0)
      return [];

    return route.optimizedRoute.map((route) => ({
      vehicleId: route.vehicleId,
      jobIds: route.stops
        .filter((stop) => stop.jobId)
        .map((stop) => stop.jobId),
    }));
  }, [route]);

  const findVehicleIdByJobId = (jobId: string): string => {
    return (
      jobVehicleBundles.find((bundle) => bundle.jobIds.includes(jobId))
        ?.vehicleId ?? ""
    );
  };

  const emailBundles = useMemo(() => {
    const bundles = getRoutePlanById.data?.optimizedRoute?.map((route) => {
      return {
        email: route?.vehicle?.driver?.email,
        url: `http://localhost:3000/tools/solidarity-pathways/1/route/${routeId}/path/${
          route.id
        }?pc=${generatePasscode(route?.vehicle?.driver?.email as string)}`,
        passcode: generatePasscode(route?.vehicle?.driver?.email as string),
      };
    });

    return bundles?.filter((bundle) => bundle.email);
  }, [getRoutePlanById.data?.optimizedRoute, routeId]);

  return {
    data: getRoutePlanById.data ?? null,
    isLoading: getRoutePlanById.isLoading,
    optimized: getRoutePlanById.data?.optimizedRoute ?? [],
    assigned: assignedJobs,
    unassigned: unassignedJobs,
    unassignedIds: unassignedJobs.map((job) => job.job.id),
    calculate: calculateRoutes,
    bundles: jobVehicleBundles,
    findVehicleIdByJobId,
    emailBundles,
  };
};
