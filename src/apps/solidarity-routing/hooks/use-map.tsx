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
  const [isSimulatingGPS, setIsSimulatingGPS] = useState(false); // New state variable for GPS simulation tracking

  const [status, setStatus] = useState<"idle" | "active">("idle");

  const driverBundles = useDriverVehicleBundles();
  const jobs = useClientJobBundles();

  const { pathId } = useSolidarityState();

  const optimizedRoutePlan = useOptimizedRoutePlan();

  const urlParams = new URLSearchParams(window.location.search);
  const driverId = urlParams.get('driverId');

  const vehicleId = driverId;
  const matchedGeoJson = optimizedRoutePlan.mapData.geometry.find(
    geo => geo.vehicleId === vehicleId
  )?.geoJson;

  let currentCoordinateIndexRef = 0
  const matchedPlanLatLng = useRef([]);

  if (matchedGeoJson) {
    const geoJson = formatGeometryString(matchedGeoJson, vehicleId);
    matchedPlanLatLng.current = geoJson.coordinates;
  } else {
    console.error(`Error: No matching plan found for vehicleId: ${vehicleId}`);
  }
  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (constantUserTracking) {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
      locationUpdateIntervalRef.current = setInterval(() => {


        let useThisLatitude = 0
        let useThisLongitude = 0
        let useThisAccuracy = 0
        // Use simulateMovementAlongRoute if simulating GPS, otherwise use getCurrentLocation
        if (isSimulatingGPS) {
          //simulateMovementAlongRoute();
          //currentCoordinateIndexRef.current = (currentCoordinateIndexRef.current + 1) % matchedPlanLatLng.current.length;
          currentCoordinateIndexRef = (currentCoordinateIndexRef + 1) % matchedPlanLatLng.current.length;

          console.log(
            'match geom', matchedGeoJson, '\n',
            'match pla', matchedPlanLatLng, matchedPlanLatLng.current.length, '\n',
            'currentCoordinateIndexRef ', currentCoordinateIndexRef,
            ' new lat lon', matchedPlanLatLng.current[currentCoordinateIndexRef]
          )

          useThisLatitude = matchedPlanLatLng.current[currentCoordinateIndexRef][1]
          useThisLongitude = matchedPlanLatLng.current[currentCoordinateIndexRef][0]
          useThisAccuracy = 1

        } else {
          getCurrentLocation(setCurrentLocation);

          useThisLatitude = currentLocation.latitude
          useThisLongitude = currentLocation.longitude
          useThisAccuracy = currentLocation.accuracy
        }

        // todo:  if we loc 0,0 then redo the call?


        console.log(
          '  \t current location is ', currentLocation
        )

        if (pathId && 
            currentLocation.latitude && 
            currentLocation.longitude){
              void axios.post("/api/routing/update-user-location", {
                latitude: useThisLatitude, //currentLocation.latitude,
                longitude: useThisLongitude, //currentLocation.longitude,
                pathId: pathId,
              });
            }

        if ('error' in currentLocation && 
            currentLocation.error && 
            !alertTriggered){
              console.log(`Error: ${currentLocation.message} (Code: ${currentLocation.code})`)
              setAlertTriggered(true);
        }
        else{
          console.log('current location', currentLocation)
        }        

      }, 1500); // Adjust based on your needs
    }

    return () => {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
    };
  }, [constantUserTracking, isSimulatingGPS, matchedPlanLatLng]); // Add isSimulatingGPS to the dependency array

  const [currentLocation, setCurrentLocation] = useState<
    Partial<GeolocationCoordinates>
  >({
    latitude: 0,
    longitude: 0,
    accuracy: 0
  });

  const simulateMovementAlongRoute = () => {
    setIsSimulatingGPS(true); // Set isSimulatingGPS to true when simulation starts
  }

  const stopSimulation = useCallback(() => {
    setIsSimulatingGPS(false); // Set isSimulatingGPS to false when simulation stops
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
    // thre's abug where you have to press twice to make this "go"
    // should we remove the currentLocation check ?
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
