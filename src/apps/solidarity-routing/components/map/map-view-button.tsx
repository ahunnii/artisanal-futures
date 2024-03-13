import { forwardRef, useImperativeHandle, useRef, useState, useEffect } from "react";

import axios from "axios";

import type { Map as LeafletMap } from "leaflet";
import { Expand, Locate } from "lucide-react";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { Button } from "~/components/ui/button";

import useMap from "~/apps/solidarity-routing/hooks/use-map";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";

import { cn } from "~/utils/styles";

export type MapPoint = {
  id: string;
  partnerId?: string;
  isAssigned?: boolean;
  type: "vehicle" | "job";
  lat: number;
  lng: number;
  name: string;
  address: string;
  color: string;
};

interface MapRef {
  reactLeafletMap: LeafletMap | null;
}

export const MapViewButton = ({ mapRef }: { mapRef: LeafletMap }) => {
  const [enableTracking, setEnableTracking] = useState(false);
  const [toggleLocationBtn, setToggleLocationBtn] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  const params = {
    mapRef,
    trackingEnabled: true,
    constantUserTracking: enableTracking,
  };

  const {
    expandViewToFit,
    flyToCurrentLocation,
    currentLocation,
    toggleConstantTracking,
    constantTracking,
    simulateMovementAlongRoute,
    stopSimulation
  } = useMap(params);

  const { pathId } = useSolidarityState();

  useEffect(() => {
    let lastPosition = { lat: null, lng: null };
    const checkDriverMovement = () => {
      if (currentLocation && lastPosition.lat && lastPosition.lng) {
        const distance = Math.sqrt(
          Math.pow(currentLocation.lat - lastPosition.lat, 2) +
          Math.pow(currentLocation.lng - lastPosition.lng, 2)
        );
        if (distance > 0.002) { // approximately 2 meters difference
          flyToCurrentLocation();
        }
      }
      lastPosition = { ...currentLocation };
    };

    const movementInterval = setInterval(checkDriverMovement, 1000); // check every second

    return () => clearInterval(movementInterval);
  }, [currentLocation, flyToCurrentLocation]);

  return (
    <div>
      {pathId && (
        <Button
          className={cn(
            "absolute top-3 right-44 z-[1000]",
            !enableTracking && "right-16"
          )}
          variant={enableTracking ? "secondary" : "default"}
          onClick={() => {
            setEnableTracking(!enableTracking);
            toggleConstantTracking(); // Start or stop transmitting location
          }}
        >
          {enableTracking ? "Stop" : "Start"} Location Services
        </Button>
      )}

      <Button
        className={
          cn("absolute top-16 right-44 z-[1000]", 
          isSimulating && "bg-red-500")
        }
        onClick={() => {
          if (isSimulating) {
            setIsSimulating(false);
            //stopSimulation()
          } else {
            setIsSimulating(true);
            //simulateMovementAlongRoute();

          axios.get(`/api/routing/route-coordinates?pathId=${pathId}`)
            .then(response => {
              console.log('Route Coordinates:', response.data);
            })
            .catch(error => console.error('Fetching route coordinates failed:', error));
          }
        }}
      >
        {isSimulating ? "Stop Simulation" : "Start Simulation"}
      </Button>
    </div>
  );
};
