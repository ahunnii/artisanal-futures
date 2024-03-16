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

import { useMapStore } from '~/apps/solidarity-routing/stores/use-map-store';  

type TUseMapProps = {
  mapRef: Map;
  currentLocation?: Partial<GeolocationCoordinates>;
  trackingEnabled?: boolean;
  driverEnabled?: boolean;
  constantUserTracking?: boolean;
};

const useMap = ({
  mapRef,
  driverEnabled = true, //false, // was false
  constantUserTracking = true //false, // was false
}: TUseMapProps) => {
  const [initial, setInitial] = useState(true);
  const [alertTriggered, setAlertTriggered] = useState(false);

  //const [flyToDriver, setFlyToDriver] = useState(true);
  //const [constantTracking, setConstantTracking] = useState(true);
  const [isSimulatingGPS, setIsSimulatingGPS] = useState(false);

  const { 
    flyToDriver,
    setFlyToDriver,
    constantTracking,
    setConstantTracking,
    locationMessage,
    setLocationMessage
  } = useMapStore();
  

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

  const currentCoordinateIndexRef = useRef(0);
  const matchedPlanLatLng = useRef([]);

  if (matchedGeoJson) {
    const geoJson = formatGeometryString(matchedGeoJson, vehicleId);
    matchedPlanLatLng.current = geoJson.coordinates;
  } else {
    if(driverId) console.error(`Error: No matching plan found for vehicleId: ${vehicleId}`);
  }
  const locationUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const [currentLocation, setCurrentLocation] = useState<
    Partial<GeolocationCoordinates>
  >({
    latitude: 0,
    longitude: 0,
    accuracy: 0
  });

  // const [locationMessage, setLocationMessage] = useState<
  //   { error: boolean, message: string }
  // >({
  //   error: true,
  //   message: '[initial run]' // we need some time to warm up i guess
  // });


  useEffect(() => {

    if (!driverId){return} // if this is a distributor we don't need to run this logic at all

    if (constantUserTracking) {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
      locationUpdateIntervalRef.current = setInterval(() => {
        let useThisLatitude = 0
        let useThisLongitude = 0
        let useThisAccuracy = 0

        if (isSimulatingGPS && matchedPlanLatLng.current.length > 0) {
          //currentCoordinateIndexRef = (currentCoordinateIndexRef + 1) % 
          currentCoordinateIndexRef.current = (currentCoordinateIndexRef.current + 1) % matchedPlanLatLng.current.length;

          matchedPlanLatLng.current.length;

          useThisLatitude = matchedPlanLatLng.current[currentCoordinateIndexRef.current][1]
          useThisLongitude = matchedPlanLatLng.current[currentCoordinateIndexRef.current][0]
          useThisAccuracy = 1

          locationMessage.error = false
          locationMessage.message = "success"

          console.log(
            currentCoordinateIndexRef.current,
            useThisLatitude,
            "update from simlulation",
            matchedPlanLatLng.current.length
          )

        } else {
          getCurrentLocation(
            setCurrentLocation,
            setLocationMessage
          );
        }

        if(!isSimulatingGPS){
          useThisLatitude = currentLocation.latitude
          useThisLongitude = currentLocation.longitude
          useThisAccuracy = currentLocation.accuracy
        }
        else{
          // update currentLocation so that other features can use it
          setCurrentLocation({
            latitude: useThisLatitude,
            longitude: useThisLongitude,
            accuracy: useThisAccuracy
          })
          console.log(
            "I think i'm overwriting w original values?",
            useThisLatitude, useThisLongitude,
            currentLocation.latitude, currentLocation.longitude,
            currentCoordinateIndexRef.current, "< current index"
            )
        }

        if(flyToDriver && useThisLatitude){
          // locationMessage.error seems to be lagged
          const currentZoom = mapRef.getZoom();
          flyToCurrentLocation(currentZoom)

          // console.log(
          //   "currentZoom ", currentZoom,
          //   "currentLocatin ", currentLocation,
          //   "!locationMessage.error ", !locationMessage.error
          // )

        }

        if (pathId &&  useThisLatitude && !locationMessage.error){
              void axios.post("/api/routing/update-user-location", {
                latitude: useThisLatitude,
                longitude: useThisLongitude,
                pathId: pathId,
              });
            }
      }, 2500); // Adjust based on your needs
    }

    return () => {
      if (locationUpdateIntervalRef.current) {
        clearInterval(locationUpdateIntervalRef.current);
      }
    };
  }, [
    constantUserTracking, 
    pathId, 
    isSimulatingGPS, 
    matchedPlanLatLng, 
    currentLocation, 
    locationMessage
  ]);

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

  const flyToCurrentLocation = (zoom: number = 8) => {
    if (currentLocation)
      flyTo(
        {
          latitude: currentLocation.latitude!,
          longitude: currentLocation.longitude!,
        },
        zoom
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

  const [hasPriorSuccess, setHasPriorSuccess] = useState(false);

  useEffect(() => {
    if (locationMessage.message === "success" && !locationMessage.error) {
      setHasPriorSuccess(true);
    }
  }, [locationMessage]);

  // Exporting a message for @map-view-button to display the Location Services state
  const exportLocationServiceMessage = () => {
    if (!constantTracking) {
      return "Start Location Services";
    } 
    if (locationMessage.message.includes("initial")) {
      return "Starting Location Services";
    } else if (locationMessage.message.includes("timed out")) {
      return "Getting Location";
    } else if (locationMessage.message.includes("success")) {
      if (!locationMessage.error && !hasPriorSuccess) {
        setHasPriorSuccess(true);
        return "Found Location";
      } else if (!locationMessage.error && hasPriorSuccess) {
        return "Stop Location Services";
      }
    } else {
      return "Locating GPS...";
    }
  };

  return {
    expandViewToFit,
    flyToDriver,
    setFlyToDriver,
    currentLocation,
    flyToCurrentLocation,
    toggleConstantTracking,
    constantTracking,
    simulateMovementAlongRoute,
    stopSimulation,
    exportLocationServiceMessage
  };
};

export default useMap;
