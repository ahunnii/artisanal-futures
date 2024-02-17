import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { clientJobDataForNewLatLng } from "~/apps/solidarity-routing/data/stop-data";
import type { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";
import { api } from "~/utils/api";
import { useSolidarityState } from "../../optimized-data/use-solidarity-state";
import { useStopsStore } from "../use-stops-store";

type Coordinates = {
  lat: number;
  lng: number;
};

type TCreateNewJobProps = {
  job: ClientJobBundle;
  addToRoute?: boolean;
};

type TCreateNewJobsProps = {
  jobs: ClientJobBundle[];
  addToRoute?: boolean;
};
export const useCreateJob = () => {
  const { isUserAllowedToSaveToDepot, depotId, routeId } = useSolidarityState();

  const sessionStorageJobs = useStopsStore((state) => state);

  const apiContext = api.useContext();

  const createJobBundles = api.jobs.createJobBundles.useMutation({
    onSuccess: () => {
      toast.success("Jobs were successfully added to route.");
    },
    onError: (e: unknown) => {
      console.error(e);
      toast.error("There was an error adding jobs to route.");
    },
    onSettled: () => {
      void apiContext.jobs.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const createNewJobByLatLng = ({ lat, lng }: Coordinates) => {
    const driver = clientJobDataForNewLatLng(lat, lng);

    if (isUserAllowedToSaveToDepot) {
      createJobBundles.mutate({
        bundles: [driver],
        depotId: Number(depotId),
        routeId: routeId as string,
      });
    } else {
      sessionStorageJobs.appendLocation(driver);
    }
  };

  const createNewJob = ({ job, addToRoute }: TCreateNewJobProps) => {
    if (isUserAllowedToSaveToDepot) {
      createJobBundles.mutate({
        bundles: [
          { job: job.job, client: job.client?.email ? job.client : undefined },
        ],
        depotId,
        routeId: addToRoute ? (routeId as string) : undefined,
      });
    } else {
      sessionStorageJobs.appendLocation({
        job: job.job,
        client: job.client?.email ? job.client : undefined,
      });
    }
  };

  const createNewJobs = ({ jobs, addToRoute }: TCreateNewJobsProps) => {
    const filterClientsWithoutEmails = jobs.map((job) => ({
      job: job.job,
      client: job.client?.email ? job.client : undefined,
    }));

    if (isUserAllowedToSaveToDepot) {
      createJobBundles.mutate({
        bundles: filterClientsWithoutEmails,
        depotId,
        routeId: addToRoute ? (routeId as string) : undefined,
      });
    } else {
      filterClientsWithoutEmails.forEach((job) => {
        sessionStorageJobs.appendLocation(job);
      });
    }
  };

  return {
    createNewJob,
    createNewJobs,
    createNewJobByLatLng,
  };
};
