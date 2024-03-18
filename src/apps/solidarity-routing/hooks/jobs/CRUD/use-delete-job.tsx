import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import { usePathname } from "next/navigation";

import toast from "react-hot-toast";

import { useSolidarityState } from "../../optimized-data/use-solidarity-state";
import { useStopsStore } from "../use-stops-store";

export const useDeleteJob = () => {
  const { data: session } = useSession();
  const sessionStorageJobs = useStopsStore((state) => state);

  const pathname = usePathname();

  const apiContext = api.useContext();

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = (session?.user ?? null) && !isSandbox;

  const { routeId } = useSolidarityState();

  const deleteFromRoute = api.jobs.deleteJob.useMutation({
    onSuccess: () => toast.success("Job successfully removed from route."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });
  const deleteOnlyFromRoute = api.jobs.deleteJobFromRoute.useMutation({
    onSuccess: () => toast.success("Job successfully removed from route."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const deleteFromDepot = api.jobs.deleteClient.useMutation({
    onSuccess: () =>
      toast.success("Client was successfully removed from the depot."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.drivers.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const deleteJobFromRoute = ({ id }: { id: string | undefined }) => {
    if (isUserAllowedToSaveToDepot && id) {
      deleteFromRoute.mutate({
        jobId: id,
      });
    } else {
      const temp = sessionStorageJobs.locations.filter(
        (loc) => loc.job.id !== sessionStorageJobs.activeLocation?.job.id
      );
      sessionStorageJobs.setLocations(temp);
    }
  };

  const deleteClientFromDepot = ({ id }: { id: string }) => {
    if (isUserAllowedToSaveToDepot && id) {
      deleteFromDepot.mutate({
        clientId: id,
      });
    } else {
      throw new Error("Depots are not a thing in the sandbox.");
    }
  };

  const deleteJobsFromRoute = ({ jobs }: { jobs: string[] }) => {
    if (isUserAllowedToSaveToDepot) {
      jobs.forEach((job) => {
        deleteOnlyFromRoute.mutate({
          jobId: job,
          routeId,
        });
      });
    } else {
      const temp = sessionStorageJobs.locations.filter(
        (loc) => !jobs.includes(loc.job.id)
      );
      sessionStorageJobs.setLocations(temp);
    }
  };

  return {
    deleteClientFromDepot,
    deleteJobFromRoute,
    deleteJobsFromRoute,
  };
};
