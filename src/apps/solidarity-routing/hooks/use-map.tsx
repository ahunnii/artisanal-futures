import polyline from "@mapbox/polyline";
import L, { type LatLngExpression, type Map } from "leaflet";
import { useCallback, useEffect, useState } from "react";
import type {
  Coordinates,
  ExpandedRouteData,
  GeoJsonData,
  Polyline,
  RouteData,
  StepData,
  VroomResponse,
} from "~/apps/solidarity-routing/types";

import { getCurrentLocation } from "~/apps/solidarity-routing/utils/realtime-utils";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "./jobs/use-client-job-bundles";

type TUseMapProps = {
  mapRef: Map;
  currentLocation?: Partial<GeolocationCoordinates>;
  trackingEnabled?: boolean;
  driverEnabled?: boolean;
  constantUserTracking?: boolean;
};

const useMap = ({
  mapRef,
  trackingEnabled = false,
  driverEnabled = false,
  constantUserTracking = false,
}: TUseMapProps) => {
  const [initial, setInitial] = useState(true);

  const drivers = useDriverVehicleBundles();
  const jobs = useClientJobBundles();

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

  const enableConstantTracking = () => {
    setInterval(() => {
      getCurrentLocation(setCurrentLocation);
    }, 5000);
  };

  useEffect(() => {
    if (constantUserTracking) enableConstantTracking();
  }, [constantUserTracking]);

  useEffect(() => {
    if (constantUserTracking) getCurrentLocation(setCurrentLocation);
  }, [driverEnabled, constantUserTracking]);

  //   Solutions to tracking map. Focuses on the selected route.

  useEffect(() => {
    if (drivers.active && mapRef)
      flyTo(drivers.active.vehicle.startAddress, 15);
  }, [drivers.active, mapRef, flyTo]);

  useEffect(() => {
    if (jobs.active && mapRef) flyTo(jobs.active.job.address, 15);
  }, [jobs.active, mapRef, flyTo]);

  const expandViewToFit = useCallback(() => {
    if (
      ((jobs.data && jobs.data.length > 0) ||
        (drivers && drivers.data.length > 0)) &&
      mapRef
    ) {
      const driverBounds = drivers.data.map(
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
  }, [mapRef, drivers, jobs]);

  useEffect(() => {
    if (initial && mapRef && drivers.data && jobs.data) {
      expandViewToFit();
      setInitial(false);
    }
  }, [expandViewToFit, mapRef, drivers.data, jobs.data, initial]);

  return {
    expandViewToFit,
    flyTo,
    convertToGeoJSON,
    convertSolutionToGeoJSON,
    currentLocation,
    flyToCurrentLocation,
  };
};

export default useMap;
