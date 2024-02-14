import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect } from "react";

import toast from "react-hot-toast";
import type { ClientJobBundle } from "../../types.wip";
import { useCreateJob } from "./CRUD/use-create-job";
import { useDeleteJob } from "./CRUD/use-delete-job";
// import { useReadJob } from "./CRUD/use-read-job";
import { useUpdateJob } from "./CRUD/use-update-job";
import { useStopsStore } from "./use-stops-store";

//With two ways to use the application, this manages the state of the depot either from zustand or from the database
export const useClientJobBundles = () => {
  const { data: session, status } = useSession();

  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  // const readJob = useReadJob();
  const createJob = useCreateJob();
  const updateJob = useUpdateJob();
  const deleteJob = useDeleteJob();

  const sessionStorageStops = useStopsStore((state) => state);

  const routeId = params?.routeId as string;
  const depotId = params?.depotId as string;

  const isSandbox = pathname?.includes("sandbox");
  const isUserAllowedToSaveToDepot = session?.user !== null && !isSandbox;

  const apiContext = api.useContext();
  const searchParams = useSearchParams();

  const user = session?.user ?? null;

  const { data: clients } = api.clients.getDepotClients.useQuery(
    { depotId: Number(depotId) },
    { enabled: status === "authenticated" }
  );

  const getRouteJobs = api.routePlan.getJobBundles.useQuery(
    { routeId },
    { enabled: isUserAllowedToSaveToDepot && routeId !== undefined }
  );

  const { data: depotStops, isLoading: depotStopsLoading } =
    api.clients.getCurrentDepotClientJobBundles.useQuery(
      { depotId: Number(depotId) },
      { enabled: status === "authenticated" }
    );

  const { mutate: createDBJobs } =
    api.clients.createManyClientAndJob.useMutation({
      onSuccess: () => {
        toast.success("Woohoo! Jobs created!");
      },
      onError: (e) => {
        console.log(e);
        toast.error("Oops! Something went wrong!");
      },
      onSettled: () => {
        void apiContext.drivers.invalidate();
      },
    });

  const checkIfSearchParamExistsInStops = (id: string | null) => {
    return sessionStorageStops.locations?.some((stop) => stop.job.id === id);
  };

  const updateStopSearchParam = (id: number | string | null) => {
    const params = new URLSearchParams(searchParams);

    if (id) {
      params.set("stopId", `${id}`);
    } else {
      params.delete("stopId");
    }
    void router.replace(`${pathname}?${params.toString()}`);
  };

  const setActiveStop = (id: string | null) => {
    updateStopSearchParam(id);
    if (user && !isSandbox) {
      if (user && depotStops) {
        //Check if route has data
        if (getRouteJobs.data) {
          const depotStop = (
            getRouteJobs.data as unknown as ClientJobBundle[]
          )?.find((bundle: ClientJobBundle) => bundle.job.id === id);

          if (depotStop) sessionStorageStops.setActiveLocation(depotStop);
          else sessionStorageStops.setActiveLocation(null);
        }
      }
    } else {
      if (sessionStorageStops.locations)
        sessionStorageStops.setActiveLocationById(id);
      else sessionStorageStops.setActiveLocation(null);
    }
  };

  const setActiveById = (id: string | null) => {
    if (sessionStorageStops.locations) {
      updateStopSearchParam(id);
      sessionStorageStops.setActiveLocationById(id);
    }
  };

  const isActive = (id: string) => {
    return sessionStorageStops.activeLocation?.job.id === id;
  };

  const getClientById = (id: string) => {
    return clients?.find((client) => client.id === id);
  };

  const getJobById = (id: string) => {
    return getRouteJobs?.data?.find((bundle) => bundle.job.id === id);
  };

  const openStopSheet = () => sessionStorageStops.setIsStopSheetOpen(true);

  const closeStopSheet = () => sessionStorageStops.setIsStopSheetOpen(false);

  const setStopSheetState = (state: boolean) =>
    sessionStorageStops.setIsStopSheetOpen(state);

  const handleOnEdit = (id: string) => {
    setActiveById(id);
    openStopSheet();
  };

  const setStops = ({
    stops,
    saveToDB = false,
  }: {
    stops: ClientJobBundle[];
    saveToDB?: boolean;
  }) => {
    sessionStorageStops.setLocations(stops);

    if (saveToDB) createDBJobs({ data: stops, depotId: Number(depotId) });
  };

  //////
  const addStop = (stop: ClientJobBundle) => {
    sessionStorageStops.appendLocation(stop);
  };

  const updateStop = (id: string, data: Partial<ClientJobBundle>) => {
    sessionStorageStops.updateLocation(id, data);
  };

  const removeStop = (id: string) => {
    sessionStorageStops.removeLocation(id);
  };

  useEffect(() => {
    if (
      sessionStorageStops.locations &&
      checkIfSearchParamExistsInStops(searchParams.get("stopId"))
    ) {
      setActiveById(searchParams.get("stopId"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    data:
      user && !isSandbox
        ? (getRouteJobs.data as unknown as ClientJobBundle[]) ??
          sessionStorageStops.locations ??
          ([] as ClientJobBundle[])
        : sessionStorageStops.locations ?? ([] as ClientJobBundle[]),
    isDataLoading: user && !isSandbox ? getRouteJobs.isLoading : false,

    fromStoreState: sessionStorageStops.locations ?? [],
    stops: sessionStorageStops.locations,

    depotStops: depotStops,
    isLoading: user ? depotStopsLoading : false,
    active: sessionStorageStops.activeLocation,

    setActive: setActiveStop,
    isStopActive: isActive,
    openStopSheet,
    closeStopSheet,
    setStopSheetState,
    editStop: handleOnEdit,
    addStop,
    updateStop,
    setStops,
    removeStop,
    isStopSheetOpen: sessionStorageStops.isStopSheetOpen,

    clients: clients ?? [],

    getClientById,
    getJobById,

    create: createJob.createNewJob,
    createMany: createJob.createNewJobs,
    createByLatLng: sessionStorageStops.addLocationByLatLng,

    updateJob: updateJob.updateRouteJob,
    updateClient: updateJob.updateDepotClient,

    deleteJob: deleteJob.deleteJobFromRoute,
    deleteClient: deleteJob.deleteClientFromDepot,

    isActive: (id: string) => {
      return sessionStorageStops.activeLocation?.job.id === id;
    },

    edit: (id: string) => {
      setActiveStop(id);
      sessionStorageStops.setIsStopSheetOpen(true);
    },

    isSheetOpen: sessionStorageStops.isStopSheetOpen,
    onSheetOpenChange: (state: boolean) => {
      if (!state) setActiveStop(null);
      sessionStorageStops.setIsStopSheetOpen(state);
    },

    isFieldJobSheetOpen: sessionStorageStops.isFieldJobSheetOpen,
    setIsFieldJobSheetOpen: sessionStorageStops.setIsFieldJobSheetOpen,

    onFieldJobSheetOpen: (state: boolean) => {
      if (!state) setActiveStop(null);
      sessionStorageStops.setIsFieldJobSheetOpen(state);
    },

    view: (id: string | null) => {
      if (!id) return;
      setActiveStop(id);
      sessionStorageStops.setIsFieldJobSheetOpen(true);
    },
  };
};
