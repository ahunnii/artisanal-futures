import { useSession } from "next-auth/react";
import { api } from "~/utils/api";

import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import type { ClientJobBundle } from "../../types.wip";
import { useStopsStore } from "../use-stops-store";

//With two ways to use the application, this manages the state of the depot either from zustand or from the database
export const useClientJobBundles = () => {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();

  const apiContext = api.useContext();
  const searchParams = useSearchParams();

  const depotId = params?.depotId as string;

  const { data: session, status } = useSession();
  const user = session?.user ?? null;

  const { data: clients } = api.clients.getDepotClients.useQuery(
    { depotId: Number(depotId) },
    { enabled: status === "authenticated" }
  );

  const { data: depotStops, isLoading: depotStopsLoading } =
    api.clients.getCurrentDepotClientJobBundles.useQuery(
      { depotId: Number(depotId) },
      { enabled: status === "authenticated" }
    );

  const { mutate: createDBJobs, isLoading: isJobMutationLoading } =
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

  const sessionStorageStops = useStopsStore((state) => state);

  const checkIfSearchParamExistsInStops = (id: string | null) => {
    return sessionStorageStops.locations?.some((stop) => stop.job.id === id);
  };

  useEffect(() => {
    if (
      sessionStorageStops.locations &&
      checkIfSearchParamExistsInStops(searchParams.get("stopId"))
    ) {
      setActiveById(searchParams.get("stopId"));
    }
  }, []);

  const updateStopSearchParam = (id: number | string | null) => {
    const params = new URLSearchParams(searchParams);

    if (id) {
      params.set("stopId", `${id}`);
    } else {
      params.delete("stopId");
    }
    void router.replace(`${pathname}?${params.toString()}`);
  };

  const setActive = (id: string | null) => {
    if (user) {
      console.log(id);
      updateStopSearchParam(id);

      if (user && depotStops) {
        const depotStop = depotStops?.find(
          (bundle: ClientJobBundle) => bundle.job.id === id
        );

        if (depotStop) {
          sessionStorageStops.setActiveLocation(depotStop);
        } else {
          sessionStorageStops.setActiveLocation(null);
        }
      }
    } else {
      sessionStorageStops.setActiveLocationById(id);
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
  const addStop = (stop: ClientJobBundle, saveToDB: boolean) => {
    sessionStorageStops.appendLocation(stop);
  };

  const updateStop = (
    id: string,
    data: Partial<ClientJobBundle>,
    saveToDB: boolean
  ) => {
    sessionStorageStops.updateLocation(id, data);
  };

  const removeStop = (id: string, saveToDB: boolean) => {
    sessionStorageStops.removeLocation(id);
  };

  return {
    data: user ? depotStops : sessionStorageStops.locations,
    isDataLoading: user ? depotStopsLoading : false,
    fromStoreState: sessionStorageStops.locations ?? [],
    stops: sessionStorageStops.locations,
    clients: clients ?? [],
    depotStops: depotStops,
    isLoading: user ? depotStopsLoading : false,
    activeStop: sessionStorageStops.activeLocation,
    addStopByLatLng: sessionStorageStops.addLocationByLatLng,
    setActiveStop: setActive,
    setActiveStopById: setActiveById,
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
  };
};
