import { UnknownErrorParams } from "@prisma/client/runtime/library";
import axios from "axios";
import type { EditStopFormValues } from "~/apps/solidarity-routing/components/tracking/current-stop-form";

import type { RouteData } from "~/apps/solidarity-routing/types";

const DISPATCH_CONTACT = "/api/realtime/contact-dispatch";
const DISPATCH_LOCATION = "/api/realtime/update-location";

export const getCurrentLocation = (
  success: (coordinates: GeolocationCoordinates) => void
) => {
  if (!navigator.geolocation) {
    console.log("Your browser doesn't support the geolocation feature!");
    return;
  }

  console.log("Getting current location...");
  // navigator.geolocation.watchPosition((position) => success(position.coords));

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
