import axios from "axios";
import { useState } from "react";
import { env } from "~/env.mjs";
import { notificationService } from "~/services/notification";
import type { PromiseMessage } from "~/services/notification/types";
import { generatePassCode } from "../utils/generic/generate-passcode";
import { generateDriverPassCode } from "../utils/server/auth-driver-passcode";
import { useDepot } from "./depot/use-depot";
import { useSolidarityState } from "./optimized-data/use-solidarity-state";
import { useRoutePlans } from "./plans/use-route-plans";

export const useMassMessage = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { depotId, routeId, pathId } = useSolidarityState();
  const { currentDepot } = useDepot();
  const { getRoutePlanData } = useRoutePlans();

  const optimized = getRoutePlanData.data?.optimizedRoute ?? [];

  const getEmailBundles = async () => {
    await getRoutePlanData.refetch();

    const bundles = optimized.map((route) => {
      const passcode = generateDriverPassCode({
        pathId: pathId,
        depotCode: currentDepot?.magicCode ?? "",
        email: route?.vehicle?.driver!.email,
      });

      return {
        email: route?.vehicle?.driver?.email,
        url: `${env.NEXT_PUBLIC_APP_URL}/tools/solidarity-pathways/${depotId}/route/${routeId}/path/${route.id}?driverId=${route.vehicleId}&pc=${passcode}`,
        passcode: currentDepot?.magicCode ?? "",
      };
    });

    return bundles?.filter((bundle) => bundle.email);
  };

  const massSendRouteEmailsPromise = () => {
    setIsLoading(true);

    const massEmailPromise = new Promise((resolve, reject) => {
      getEmailBundles()
        .then((emailBundles) =>
          axios.post("/api/routing/send-route", { emailBundles })
        )
        .then((res) => {
          if (res.status === 200)
            resolve({ message: "Route(s) sent to driver(s) successfully" });

          reject({
            message: "Error sending route(s) to driver(s)",
            error: res.data,
          });
        })
        .catch((error: unknown) =>
          reject({
            message: "Error sending route(s) to driver(s)",
            error,
          })
        )
        .finally(() => setIsLoading(false));
    });

    notificationService.notifyPending(
      massEmailPromise as Promise<PromiseMessage>,
      { loadingMessage: "Sending route(s) to driver(s)..." }
    );
  };

  return {
    massSendRouteEmails: massSendRouteEmailsPromise,
    isLoading,
  };
};
