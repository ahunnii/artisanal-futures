import { useEffect } from "react";

import { useCreateJob } from "./CRUD/use-create-job";
import { useDeleteJob } from "./CRUD/use-delete-job";
// import { useReadJob } from "./CRUD/use-read-job";
import { useUrlParams } from "~/hooks/use-url-params";
import { useSolidarityState } from "../optimized-data/use-solidarity-state";
import { useReadJob } from "./CRUD/use-read-job";
import { useUpdateJob } from "./CRUD/use-update-job";
import { useStopsStore } from "./use-stops-store";

//With two ways to use the application, this manages the state of the depot either from zustand or from the database
export const useClientJobBundles = () => {
  const { updateUrlParams, getUrlParam } = useUrlParams();
  const { isUserAllowedToSaveToDepot } = useSolidarityState();

  const readJob = useReadJob();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const sessionStorageJobs = useStopsStore((state) => state);

  const setActiveJob = (id: string | null) => {
    updateUrlParams({
      key: "jobId",
      value: id,
    });

    const job = isUserAllowedToSaveToDepot
      ? readJob.checkIfJobExistsInRoute(id)
      : readJob.checkIfJobExistsInStorage(id);

    if (!job) {
      sessionStorageJobs.setActiveLocationById(null);
      return;
    }

    if (!isUserAllowedToSaveToDepot)
      sessionStorageJobs.setActiveLocationById(id);
    else sessionStorageJobs.setActiveLocation(job);
  };

  // useEffect(() => {
  //   const stopId = getUrlParam("jobId");
  //   if (stopId) setActiveJob(stopId);

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  return {
    data: readJob.routeJobs,
    isDataLoading: readJob.isLoading,

    active: sessionStorageJobs.activeLocation,
    isActive: (id: string) => {
      return sessionStorageJobs.activeLocation?.job.id === id;
    },

    clients: readJob.depotClients,

    getJobById: readJob.getJobById,
    getClientById: readJob.getClientById,

    create: createJob.createNewJob,
    createMany: createJob.createNewJobs,
    createByLatLng: createJob.createNewJobByLatLng,

    updateJob: updateJob.updateRouteJob,
    updateClient: updateJob.updateDepotClient,

    deleteJob: deleteJob.deleteJobFromRoute,
    deleteClient: deleteJob.deleteClientFromDepot,

    setIsSheetOpen: sessionStorageJobs.setIsStopSheetOpen,
    sheetState: sessionStorageJobs.jobSheetMode,
    setSheetState: sessionStorageJobs.setJobSheetMode,

    isSheetOpen: sessionStorageJobs.isStopSheetOpen,
    onSheetOpenChange: (state: boolean) => {
      if (!state) setActiveJob(null);
      sessionStorageJobs.setIsStopSheetOpen(state);
    },
    edit: (id: string) => {
      setActiveJob(id);
      sessionStorageJobs.setIsStopSheetOpen(true);
    },

    isFieldJobSheetOpen: sessionStorageJobs.isFieldJobSheetOpen,
    setIsFieldJobSheetOpen: sessionStorageJobs.setIsFieldJobSheetOpen,

    onFieldJobSheetOpen: (state: boolean) => {
      if (!state) setActiveJob(null);
      sessionStorageJobs.setIsFieldJobSheetOpen(state);
    },

    view: (id: string | null) => {
      if (!id) return;
      setActiveJob(id);
      sessionStorageJobs.setIsFieldJobSheetOpen(true);
    },

    addPrevious: () => {
      sessionStorageJobs.setJobSheetMode("add-previous");
      setActiveJob(null);
      sessionStorageJobs.setIsStopSheetOpen(true);
    },

    createNew: () => {
      sessionStorageJobs.setJobSheetMode("create-new");
      setActiveJob(null);
      sessionStorageJobs.setIsStopSheetOpen(true);
    },
  };
};
