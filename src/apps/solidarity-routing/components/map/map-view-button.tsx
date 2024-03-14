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
      console.log('\n\t... Geolocation message: ', message)
    }, 1000);

    return () => clearInterval(intervalId);
  }, [exportLocationServiceMessage]);

  return (
    <div>
      
      {pathId && (
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
      )}
      {/* Other button code remains unchanged */}
    </div>
  );
};

