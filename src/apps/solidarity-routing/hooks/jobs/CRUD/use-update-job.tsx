import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import { useParams, usePathname } from "next/navigation";

import toast from "react-hot-toast";

import type {
  ClientJobBundle,
  DriverVehicleBundle,
} from "~/apps/solidarity-routing/types.wip";
import { useStopsStore } from "../../use-stops-store";

export const useUpdateJob = () => {
  const { data: session } = useSession();
  const sessionStorageJobs = useStopsStore((state) => state);

  const pathname = usePathname();

  const params = useParams();

  const apiContext = api.useContext();

  const routeId = params?.routeId as string;
  const depotId = params?.depotId as string;

  const isSandbox = pathname?.includes("sandbox");

  const isUserAllowedToSaveToDepot = (session?.user ?? null) && !isSandbox;

  const updateJob = api.jobs.updateRouteJob.useMutation({
    onSuccess: () => toast.success("Route was successfully updated."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.jobs.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });
  const updateClient = api.jobs.updateDepotClient.useMutation({
    onSuccess: () => toast.success("Client info was successfully updated."),
    onError: (e: unknown) => {
      toast.error("Oops! Something went wrong!");
      console.error(e);
    },
    onSettled: () => {
      void apiContext.jobs.invalidate();
      void apiContext.routePlan.invalidate();
    },
  });

  const updateRouteJob = ({ bundle }: { bundle: ClientJobBundle }) => {
    if (isUserAllowedToSaveToDepot) {
      updateJob.mutate({
        routeId,
        job: bundle.job,
      });
    } else {
      sessionStorageJobs.updateLocation(bundle.job.id, bundle);
    }
  };

  const updateDepotClient = ({ bundle }: { bundle: ClientJobBundle }) => {
    if (!bundle.client) throw new Error("No client");
    if (isUserAllowedToSaveToDepot) {
      updateClient.mutate({
        depotId: Number(depotId),
        client: bundle.client,
      });
    } else {
      sessionStorageJobs.updateLocation(bundle.job.id, bundle);
    }
  };

  return {
    updateRouteJob,
    updateDepotClient,
  };
};
