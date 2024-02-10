import { useSession } from "next-auth/react";
import { useParams, usePathname } from "next/navigation";
import toast from "react-hot-toast";
import { stopData } from "~/apps/solidarity-routing/data/stops/stop-data";
import { ClientJobBundle } from "~/apps/solidarity-routing/types.wip";
import { api } from "~/utils/api";
import { useStopsStore } from "../use-stops-store";

type TCreateNewJobProps = {
  job: ClientJobBundle;
  addToRoute?: boolean;
};

type TCreateNewJobsProps = {
  jobs: ClientJobBundle[];
  addToRoute?: boolean;
};

type Coordinates = {
  lat: number;
  lng: number;
};

export const useCreateJob = () => {
  const { data: session } = useSession();
  const sessionStorageJobs = useStopsStore((state) => state);

  const pathname = usePathname();

  const params = useParams();

  const apiContext = api.useContext();

  const depotId = Number(params?.depotId as string);
  const routeId = params?.routeId as string;

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = (session?.user ?? null) && !isSandbox;

  const setJobsToRoute = api.jobs.createJobBundles.useMutation({
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
      // void apiContext.clients.invalidate();
    },
  });
  // const createNewJob = ({ job, addToRoute }: TCreateNewJobProps) => void 0;
  // const createNewJobs = ({ jobs, addToRoute }: TCreateNewJobsProps) => void 0;

  const createNewJobByLatLng = ({ lat, lng }: Coordinates) => {
    const driver = stopData(lat, lng);

    if (isUserAllowedToSaveToDepot) {
      setJobsToRoute.mutate({
        bundles: [driver],
        depotId: Number(depotId),
        routeId,
      });
    } else {
      sessionStorageJobs.appendLocation(driver);
    }
  };

  // const setDepotClients = (bundles: ClientJobBundle[]) => void 0;
  // const setDepotJobs = (bundles: ClientJobBundle[]) => void 0;

  const createNewJob = ({
    job,
    addToRoute,
  }: {
    job: ClientJobBundle;
    addToRoute?: boolean;
  }) => {
    if (isUserAllowedToSaveToDepot) {
      // console.log("jobs", jobs);
      setJobsToRoute.mutate({
        bundles: [
          { job: job.job, client: job.client?.email ? job.client : undefined },
        ],
        depotId,
        routeId: addToRoute ? routeId : undefined,
      });
    } else {
      sessionStorageJobs.appendLocation({
        job: job.job,
        client: job.client?.email ? job.client : undefined,
      });
    }
  };

  const createNewJobs = ({
    jobs,
    addToRoute,
  }: {
    jobs: ClientJobBundle[];
    addToRoute?: boolean;
  }) => {
    const filterClientsWithoutEmails = jobs.map((job) => ({
      job: job.job,
      client: job.client?.email ? job.client : undefined,
    }));

    if (isUserAllowedToSaveToDepot) {
      // console.log("jobs", jobs);
      setJobsToRoute.mutate({
        bundles: filterClientsWithoutEmails,
        depotId,
        routeId: addToRoute ? routeId : undefined,
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
    // setDepotClients,
    // setDepotJobs,
    // setRouteJobs,
  };
};
