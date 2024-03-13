import L, { type LatLngExpression, type Map } from "leaflet";
import { useCallback, useEffect, useState, useRef } from "react";
import type { Coordinates } from "~/apps/solidarity-routing/types";

import axios from "axios";

import { formatGeometryString } from "~/apps/solidarity-routing/services/optimization/aws-vroom/utils";

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

  const urlParams = new URLSearchParams(window.location.search);
  const driverId = urlParams.get('driverId');

  const vehicleId = driverId; // does the url param driverId equal driverId!?

  const matchedPlanLatLng = formatGeometryString(
    optimizedRoutePlan.mapData.geometry.find(
      geo => geo.vehicleId === vehicleId)?.geoJson,
    vehicleId
  );

  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (constantUserTracking) {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
      locationUpdateIntervalRef.current = setInterval(() => {
        getCurrentLocation(setCurrentLocation);

        if (pathId && 
            currentLocation.latitude && 
            currentLocation.longitude){
              void axios.post("/api/routing/update-user-location", {
                latitude: currentLocation.latitude,
                longitude: currentLocation.longitude,
                pathId: pathId,
              });
            }

        // There's an edge case that I can't quite reproduce in testing where
        // we get Error: Timer expired, and somehow the currentLocation is overwritten w
        // data from the timer
        if ('error' in currentLocation && 
            currentLocation.error && 
            !alertTriggered){
              //alert(`Error: ${currentLocation.message} (Code: ${currentLocation.code})`);
              console.log(`ErrorX: ${currentLocation.message} (Code: ${currentLocation.code})`)
              setAlertTriggered(true);
        }
        else{
          console.log(
            'current location', currentLocation
          )
        }        

      }, 1500); // Adjust based on your needs
    }

    return () => {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
    };
  }, [constantUserTracking]);

  const [currentLocation, setCurrentLocation] = useState<
    Partial<GeolocationCoordinates>
  >({
    latitude: 0,
    longitude: 0,
    accuracy: 0
  });

  const currentCoordinateIndexRef = useRef(0);
  const incrementCurrentCoordinateIndex = () => {
    currentCoordinateIndexRef.current += 1;
  };
  const getCurrentCoordinateIndex = () => currentCoordinateIndexRef.current;
  const simulationStartedRef = useRef<NodeJS.Timeout | null>(null);

  const simulateMovementAlongRoute = useCallback(() => {
    if (simulationStartedRef.current) {
      // If the simulation has already started, don't start it again
      console.log("Simulation already in progress!")
      return;
    }
  
    simulationStartedRef.current = setInterval(() => {
      incrementCurrentCoordinateIndex();
      console.log('Current Coordinate Index:', getCurrentCoordinateIndex());
    }, 1000);
  }, []);
  
  const stopSimulation = useCallback(() => {
    if (simulationStartedRef.current) {
      clearInterval(simulationStartedRef.current);
      simulationStartedRef.current = null;
    }
  }, []);
  
  useEffect(() => {
    return () => {
      // Clean up the interval when the component unmounts
      if (simulationStartedRef.current) {
        clearInterval(simulationStartedRef.current);
        simulationStartedRef.current = null;
      }
    };
  }, []);


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
