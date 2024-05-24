import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import type { Map as LeafletMap } from "leaflet";
import { Expand, Locate, MapPin, MapPinOff } from "lucide-react";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { Button } from "~/components/ui/button";

import useMap from "~/apps/solidarity-routing/hooks/use-map";

import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";

import { useAutoAnimate } from "@formkit/auto-animate/react";
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

// export const MapViewButton = forwardRef<MapRef>(({}, ref) => {
export const DynamicMapViewButtons = ({
  mapRef,
  snap,
}: {
  mapRef: LeafletMap;
  snap: number | string | null;
}) => {
  const [enableTracking, setEnableTracking] = useState(false);
  const [toggleLocationBtn, setToggleLocationBtn] = useState(false);

  // useImperativeHandle(ref, () => ({
  //   reactLeafletMap: mapRef,
  // }));

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
  } = useMap(params);

  const { pathId } = useSolidarityState();

  const [parent] = useAutoAnimate();

  return (
    <div
      ref={parent}
      className={cn(
        "absolute  right-5 z-50 transition-all duration-300 ease-in-out",
        snap === 0.1 && "bottom-[15%]",
        snap === 0.25 && "bottom-[30%]",
        snap === 0.75 && "bottom-[85%]"
      )}
    >
      <div className="flex flex-col items-end space-y-2">
        {/* //Create a toggle button that switches between expandViewToFit and flyToCurrentLocation  */}
        <Button
          size={"icon"}
          className={cn("", !enableTracking && "bottom-3")}
          onClick={() => {
            if (enableTracking) {
              toggleLocationBtn ? flyToCurrentLocation() : expandViewToFit();
              setToggleLocationBtn(!toggleLocationBtn);
              return;
            }
            expandViewToFit();
          }}
        >
          {enableTracking && toggleLocationBtn ? (
            <Locate size={24} />
          ) : (
            <Expand size={24} />
          )}
        </Button>
        {/* {enableTracking && (
          <Button
            // className={cn("absolute bottom-3 right-3 z-[1000]")}
            onClick={flyToCurrentLocation}
          >
            Center to Location
          </Button>
        )} */}{" "}
        <div className="flex gap-2">
          {enableTracking && (
            <Button
              // className={cn("absolute right-20 top-3 z-[1000]")}
              onClick={toggleConstantTracking}
            >
              {constantTracking ? "Stop" : "Start"} transmitting realtime
            </Button>
          )}
          {pathId && (
            <Button
              size={"icon"}
              className={cn(
                // "absolute bottom-3 right-44 z-[1000]",
                !enableTracking && "right-16"
              )}
              variant={enableTracking ? "secondary" : "default"}
              onClick={() => setEnableTracking(!enableTracking)}
            >
              {enableTracking ? <MapPinOff size={24} /> : <MapPin size={24} />}
            </Button>
          )}{" "}
        </div>
      </div>
    </div>
  );
  // });
};
// MapViewButton.displayName = "MapViewButton";
