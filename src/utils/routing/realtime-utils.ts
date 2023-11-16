import axios from "axios";
import type { EditStopFormValues } from "~/components/tools/routing/tracking/current-stop-form";
import type { RouteData } from "~/components/tools/routing/types";
import type { useDriverRouteStore } from "~/hooks/routing/use-driver-routes";

const DISPATCH_CONTACT = "/api/realtime/contact-dispatch";
const DISPATCH_LOCATION = "/api/realtime/update-location";

export const sendMessage = async (
  data: EditStopFormValues,
  store: useDriverRouteStore,
  routeId: string,
  routeData?: RouteData
) => {
  const { address } = JSON.parse(store.selectedStop!.description ?? "{}");

  const payload = {
    ...data,
    address,
    route: routeData,
    routeId: routeId,
    stopId: store.selectedStop!.job,
  };

  store.updateStop({
    ...store.selectedStop!,
    status: data.status ?? "pending",
    deliveryNotes: data.deliveryNotes ?? "",
  });
  return axios.post(DISPATCH_CONTACT, payload).catch(console.error);
};

export const getCurrentLocation = (
  success: (coordinates: GeolocationCoordinates) => void
) => {
  if (!navigator.geolocation) {
    console.log("Your browser doesn't support the geolocation feature!");
    return;
  }

  navigator.geolocation.getCurrentPosition((position) =>
    success(position.coords)
  );
};

export const sendCurrentLocation = (routeId: string, routeData: RouteData) => {
  const successCallback = (coordinates: GeolocationCoordinates) => {
    const { latitude, longitude, accuracy } = coordinates;
    const payload = {
      latitude,
      longitude,
      accuracy,
      fileId: routeId,
      route: routeData,
    };
    axios.post(DISPATCH_LOCATION, payload).catch(console.error);
  };

  getCurrentLocation(successCallback);
};

export const removeCurrentLocation = () => {
  const payload = {
    removeUser: true,
  };
  axios.post(DISPATCH_LOCATION, payload).catch(console.error);
};
