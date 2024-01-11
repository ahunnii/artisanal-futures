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
} from "~/components/tools/routing/types";

import { useDrivers } from "./use-drivers";

import { getCurrentLocation } from "~/apps/solidarity-routing/libs/realtime-utils";
import { useDriverRoute } from "./use-driver-routes";
import { useFinalizedRoutes } from "./use-finalized-routes";
import { useStops } from "./use-stops";

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
  const { selectedRoute, routes } = useFinalizedRoutes((state) => state);
  const { drivers, activeDriver } = useDrivers((state) => state);
  const { locations, activeLocation } = useStops((state) => state);
  const { stops, selectedStop } = useDriverRoute((state) => state);

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
    console.log(currentLocation);
  }, [currentLocation]);

  useEffect(() => {
    if (constantUserTracking) enableConstantTracking();
  }, [constantUserTracking]);

  useEffect(() => {
    getCurrentLocation(setCurrentLocation);
  }, [driverEnabled]);

  //   Solutions to tracking map. Focuses on the selected route.
  useEffect(() => {
    if (selectedRoute && mapRef && trackingEnabled) {
      const stepCoordinates = selectedRoute?.steps
        ?.filter((step) => step.type !== "break")
        .map(
          (step) => [step?.location[1], step?.location[0]] as LatLngExpression
        );

      if (stepCoordinates.length === 0) return;
      const bounds = L.latLngBounds(stepCoordinates);

      mapRef.fitBounds(bounds);
    }
  }, [selectedRoute, mapRef, trackingEnabled]);

  useEffect(() => {
    if (mapRef && routes && trackingEnabled) {
      const allSteps = routes.map((route) => route?.steps);
      const stepCoordinates = allSteps
        .flat(1)
        ?.filter((step) => step.type !== "break")
        .map(
          (step) => [step?.location[1], step?.location[0]] as LatLngExpression
        );

      if (stepCoordinates.length === 0) return;
      const bounds = L.latLngBounds(stepCoordinates);

      mapRef.fitBounds(bounds);
    }
  }, [routes, mapRef, trackingEnabled]);

  useEffect(() => {
    if (activeDriver && mapRef) flyTo(activeDriver?.coordinates, 15);
  }, [activeDriver, mapRef, flyTo]);

  useEffect(() => {
    if (activeLocation && mapRef) flyTo(activeLocation?.coordinates, 15);
  }, [activeLocation, mapRef, flyTo]);

  useEffect(() => {
    if (
      ((locations && locations.length > 0) ||
        (drivers && drivers.length > 0)) &&
      mapRef
    ) {
      const bounds = L.latLngBounds(
        [...locations, ...drivers].map(
          (location) =>
            [
              location?.coordinates?.latitude,
              location?.coordinates?.longitude,
            ] as LatLngExpression
        )
      );

      mapRef.fitBounds(bounds);
    }
  }, [locations, drivers, mapRef]);

  useEffect(() => {
    if (mapRef && stops && driverEnabled) {
      const stepMap = stops
        .filter((step: StepData) => step.type !== "break")
        .map((step: StepData) => [
          step?.location?.[1] ?? 0,
          step?.location?.[0] ?? 0,
        ]);

      const totalBounds = [
        ...stepMap,
        currentLocation
          ? [currentLocation.latitude, currentLocation.longitude]
          : [],
      ];
      const temp = L.latLngBounds(totalBounds as LatLngExpression[]).pad(0.15);
      mapRef.fitBounds(temp);
      mapRef.getBoundsZoom(temp);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stops, mapRef, driverEnabled]);

  useEffect(() => {
    if (selectedStop && mapRef && driverEnabled) {
      mapRef.flyTo([selectedStop.location[1], selectedStop.location[0]], 15);
    }
  }, [selectedStop, mapRef, driverEnabled]);

  return {
    flyTo,
    convertToGeoJSON,
    convertSolutionToGeoJSON,
    currentLocation,
    flyToCurrentLocation,
  };
};

export default useMap;
