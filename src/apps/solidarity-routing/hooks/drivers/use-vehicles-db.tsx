import { api } from "~/utils/api";
import { useDriversStore } from "./use-drivers-store";

// const useVehicles = () => {};

export const depotDrivers = () =>
  api.drivers.getCurrentDepotDrivers.useQuery({
    depotId: Number(1),
  });
