import polyline from "@mapbox/polyline";
import L, { type LatLngExpression, type Map } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import type {
  Coordinates,
  ExpandedRouteData,
  GeoJsonData,
  Polyline,
  RouteData,
  VroomResponse,
} from "~/apps/solidarity-routing/types";

import axios from "axios";

import { getCurrentLocation } from "~/apps/solidarity-routing/utils/realtime-utils";
import useInterval from "~/hooks/use-interval";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "./jobs/use-client-job-bundles";
import { useSolidarityState } from "./optimized-data/use-solidarity-state";

type TUseMapProps = {
  mapRef: Map;
  currentLocation?: Partial<GeolocationCoordinates>;
  trackingEnabled?: boolean;
  driverEnabled?: boolean;
  constantUserTracking?: boolean;
};

const useMap = ({
  mapRef,

  driverEnabled = false,
  constantUserTracking = false,
}: TUseMapProps) => {
  const [initial, setInitial] = useState(true);

  const [constantTracking, setConstantTracking] = useState(false);

  const [status, setStatus] = useState<"idle" | "active">("idle");

  const driverBundles = useDriverVehicleBundles();
  const jobs = useClientJobBundles();

  const { pathId } = useSolidarityState();

  useInterval(
    () => {
      getCurrentLocation(setCurrentLocation);
      if (pathId && currentLocation)
        void axios.post("/api/realtime/update-location", {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          pathId: pathId,
        });
    },
    status === "active" ? 1000 : null
  );

  const [currentLocation, setCurrentLocation] = useState<
    Partial<GeolocationCoordinates>
  >({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });

  const flyTo = useCallback(
    (coordinates: Coordinates, zoom: number) => {
      mapRef.flyTo([coordinates.latitude, coordinates.longitude], zoom);
    },
    [mapRef]
  );

  const convertToGeoJSON = (
    route?: RouteData | ExpandedRouteData | null,
    geometry?: string,
    color?: number
  ) => {
    const temp = polyline.toGeoJSON(route?.geometry ?? geometry!) as Polyline;
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            ...temp,
            properties: { color: route?.vehicle ?? color! },
          },
        },
      ],
    } as GeoJsonData;
  };

  const convertSolutionToGeoJSON = (solution: VroomResponse) => {
    return {
      type: "FeatureCollection",
      features: solution?.geometry.map((geometry: Polyline) => {
        return {
          type: "Feature",
          geometry,
        };
      }),
    };
  };

  const flyToCurrentLocation = () => {
    if (currentLocation)
      flyTo(
        {
          latitude: currentLocation.latitude!,
          longitude: currentLocation.longitude!,
        },
        15
      );
  };

  const toggleConstantTracking = () => {
    if (pathId && currentLocation.latitude && currentLocation.longitude) {
      setStatus((status) => (status === "active" ? "idle" : "active"));
      setConstantTracking(!constantTracking);
    }
  };

  useEffect(() => {
    if (constantUserTracking) getCurrentLocation(setCurrentLocation);
  }, [driverEnabled, constantUserTracking]);

  //   Solutions to tracking map. Focuses on the selected route.

  useEffect(() => {
    if (driverBundles.active && mapRef)
      flyTo(driverBundles.active.vehicle.startAddress, 15);
  }, [driverBundles.active, mapRef, flyTo]);

  useEffect(() => {
    if (jobs.active && mapRef) flyTo(jobs.active.job.address, 15);
  }, [jobs.active, mapRef, flyTo]);

  const expandViewToFit = useCallback(() => {
    if (
      ((jobs.data && jobs.data.length > 0) ||
        (driverBundles && driverBundles.data.length > 0)) &&
      mapRef
    ) {
      const driverBounds = driverBundles.data.map(
        (driver) =>
          [
            driver.vehicle.startAddress.latitude,
            driver.vehicle.startAddress.longitude,
          ] as LatLngExpression
      );
      const locationBounds = jobs.data.map(
        (location) =>
          [
            location.job.address.latitude,
            location.job.address.longitude,
          ] as LatLngExpression
      );
      const bounds = L.latLngBounds([...driverBounds, ...locationBounds]);

      mapRef.fitBounds(bounds);
    }
  }, [mapRef, driverBundles, jobs]);

  useEffect(() => {
    if (initial && mapRef && driverBundles.data && jobs.data) {
      expandViewToFit();
      setInitial(false);
    }
  }, [expandViewToFit, mapRef, driverBundles.data, jobs.data, initial]);

  return {
    expandViewToFit,
    flyTo,
    convertToGeoJSON,
    convertSolutionToGeoJSON,
    currentLocation,
    flyToCurrentLocation,
    toggleConstantTracking,
    constantTracking,
  };
};

export default useMap;
