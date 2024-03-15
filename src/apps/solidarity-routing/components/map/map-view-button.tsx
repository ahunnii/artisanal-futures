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
  const [enableTracking, setEnableTracking] = useState(true); // was false; browser will ask
  const [toggleLocationBtn, setToggleLocationBtn] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [buttonMessage, setButtonMessage] = useState<string>('');

  const params = {
    mapRef,
    trackingEnabled: true,
    constantUserTracking: enableTracking,
  };

  const {
    expandViewToFit,
    flyToCurrentLocation,
    setFlyToDriver,
    flyToDriver,
    currentLocation,
    toggleConstantTracking,
    constantTracking,
    simulateMovementAlongRoute,
    stopSimulation,
    exportLocationServiceMessage
  } = useMap(params);

  const { pathId } = useSolidarityState();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const message = exportLocationServiceMessage()
      setButtonMessage(message);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [exportLocationServiceMessage]);

  const toggleFlyToTimer = () => {
    setFlyToDriver(prev => !prev)
  };
  
  return (
    <div>
      
      {/* {pathId && (
        <Button
          className={cn(
            "absolute top-3 right-44 z-[1000]",
            buttonMessage.includes("Stop") && "bg-red-300",
            buttonMessage.includes("Get") && "animate-pulse"
          )}
          variant={enableTracking ? "secondary" : "default"}
          onClick={() => {
            setEnableTracking(!enableTracking);
            toggleConstantTracking();
          }}
        >
          {buttonMessage}
        </Button>
      )} */}

      <Button
        className={
          cn("absolute bottom-10  z-[1000]", 
          isSimulating && "bg-red-500")
        }
        onClick={() => {
          if (isSimulating) {
            setIsSimulating(false);
            stopSimulation()
          } else {
            setIsSimulating(true);
            simulateMovementAlongRoute();
          }
        }}
      >
        {isSimulating ? "Stop Demo" : "Start Demo"}
      </Button>

      {/* <Button
        className="absolute top-3 right-16 z-[1000]"
        onClick={toggleFlyToTimer}
      >
        <Locate size={16} /> {flyToDriver ? 'Stop Centering' : 'Center Map'}
      </Button> */}


    </div>
  );
};

