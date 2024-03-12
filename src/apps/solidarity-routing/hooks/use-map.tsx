import L, { type LatLngExpression, type Map } from "leaflet";
import { useCallback, useEffect, useState, useRef } from "react";
import type { Coordinates } from "~/apps/solidarity-routing/types";

import axios from "axios";

import { getCurrentLocation } from "~/apps/solidarity-routing/utils/get-current-location";
import useInterval from "~/hooks/use-interval";
import { useDriverVehicleBundles } from "./drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "./jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "./optimized-data/use-optimized-route-plan";
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
  const [alertTriggered, setAlertTriggered] = useState(false);

  const [constantTracking, setConstantTracking] = useState(false);

  const [status, setStatus] = useState<"idle" | "active">("idle");

  const driverBundles = useDriverVehicleBundles();
  const jobs = useClientJobBundles();

  const { pathId } = useSolidarityState();

  const optimizedRoutePlan = useOptimizedRoutePlan();

  useInterval(
    () => {
      if (
        !constantUserTracking &&
        currentLocation.latitude === 0 &&
        currentLocation.longitude === 0
      )
        return;

      getCurrentLocation(setCurrentLocation);
      if (pathId && currentLocation.latitude && currentLocation.longitude)
        void axios.post("/api/routing/update-user-location", {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          pathId: pathId,
        });

        if ('error' in currentLocation && currentLocation.error && !alertTriggered) {
          //alert(`Error: ${currentLocation.message} (Code: ${currentLocation.code})`);
          console.log(`Error: ${currentLocation.message} (Code: ${currentLocation.code})`)
          setAlertTriggered(true);
        }
        else{
          console.log(
            currentLocation
          )
        }
    },
    status === "active" ? 1500 : 10000 // was 1000
  );

  const [currentLocation, setCurrentLocation] = useState<
    Partial<GeolocationCoordinates>
  >({
    latitude: 0,
    longitude: 0,
    accuracy: 0
  });

  const flyTo = useCallback(
    (coordinates: Coordinates, zoom: number) => {
      mapRef.flyTo([coordinates.latitude, coordinates.longitude], zoom);
    },
    [mapRef]
  );

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

  const expandViewToFit = useCallback(() => {
    if (
      ((jobs.data && jobs.data.length > 0) ||
        (driverBundles && driverBundles.data.length > 0)) &&
      mapRef
    ) {
      const driverBounds = pathId
        ? optimizedRoutePlan.mapCoordinates.driver
        : driverBundles.data.map(
            (driver) =>
              [
                driver.vehicle.startAddress.latitude,
                driver.vehicle.startAddress.longitude,
              ] as LatLngExpression
          );
      const locationBounds = pathId
        ? optimizedRoutePlan.mapCoordinates.jobs
        : jobs.data.map(
            (location) =>
              [
                location.job.address.latitude,
                location.job.address.longitude,
              ] as LatLngExpression
          );
      const bounds = L.latLngBounds([...driverBounds, ...locationBounds]);

      mapRef.fitBounds(bounds);
    }
  }, [mapRef, driverBundles, jobs, optimizedRoutePlan, pathId]);

  useEffect(() => {
    if (constantUserTracking) getCurrentLocation(setCurrentLocation);
  }, [driverEnabled, constantUserTracking, status]);

  useEffect(() => {
    if (driverBundles.active && mapRef)
      flyTo(driverBundles.active.vehicle.startAddress, 15);
  }, [driverBundles.active, mapRef, flyTo]);

  useEffect(() => {
    if (jobs.active && mapRef) flyTo(jobs.active.job.address, 15);
  }, [jobs.active, mapRef, flyTo]);

  useEffect(() => {
    if (initial && mapRef && driverBundles.data && jobs.data) {
      expandViewToFit();
      setInitial(false);
    }
  }, [expandViewToFit, mapRef, driverBundles.data, jobs.data, initial]);

  const simulationIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const simulateMovementAlongRoute = useCallback(() => {
    if (simulationIntervalRef.current) return () => {}; // Return a no-op function if the interval is already running

    if (pathId && currentLocation.latitude && currentLocation.longitude) {
      const stops = optimizedRoutePlan.mapCoordinates.jobs.concat(optimizedRoutePlan.mapCoordinates.driver);
      let currentStopIndex = 0;
      simulationIntervalRef.current = setInterval(() => {
        if (currentStopIndex < stops.length) {
          const currentStop = stops[currentStopIndex];
          const distanceToStop = L.latLng(currentLocation.latitude, currentLocation.longitude).distanceTo(L.latLng(currentStop[0], currentStop[1]));
          if (distanceToStop < 50) { // Assuming 50 meters as "near"
            setTimeout(() => {
              currentStopIndex++;
            }, 30000); // Pause for 30 seconds
          } else {
            const angle = Math.atan2(currentStop[1] - currentLocation.longitude, currentStop[0] - currentLocation.latitude);
            setCurrentLocation(prevLocation => ({
              ...prevLocation,
              latitude: prevLocation.latitude + Math.cos(angle) * 0.0001, // Roughly 20 mph in lat change
              longitude: prevLocation.longitude + Math.sin(angle) * 0.0001, // Roughly 20 mph in lng change
            }));
          }
        } else {
          clearInterval(simulationIntervalRef.current);
          simulationIntervalRef.current = null;
        }
      }, 500);

      // Return a function to clear the interval, aligning with useEffect cleanup pattern
      return () => {
        if (simulationIntervalRef.current) {
          clearInterval(simulationIntervalRef.current);
          simulationIntervalRef.current = null;
        }
      };
    }

    // Return a no-op function if no simulation is started
    return () => {};
  }, [pathId, currentLocation, optimizedRoutePlan]);

  const stopSimulation = useCallback(() => {
    if (simulationIntervalRef.current) {
      clearInterval(simulationIntervalRef.current);
      simulationIntervalRef.current = null;
    }
  }, []);

  useEffect(() => {
    const clearSimulation = simulateMovementAlongRoute();
    return () => clearSimulation();
  }, [simulateMovementAlongRoute]);

  return {
    expandViewToFit,
    flyTo,
    currentLocation,
    flyToCurrentLocation,
    toggleConstantTracking,
    constantTracking,
    simulateMovementAlongRoute,
    stopSimulation,
  };
};

export default useMap;
