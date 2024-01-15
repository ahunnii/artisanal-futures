import { forwardRef, useImperativeHandle, useRef } from "react";

import type { Map } from "leaflet";
import { type LatLngExpression } from "leaflet";
import { Circle, GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { useDriverRoute } from "~/apps/solidarity-routing/hooks/use-driver-routes";
import useMap from "~/apps/solidarity-routing/hooks/use-map";
import { getStyle } from "~/apps/solidarity-routing/libs/color-handling";
import type { RouteData, StepData } from "~/apps/solidarity-routing/types";

import { Button } from "~/components/ui/button";
import { cn } from "~/utils/styles";
import { MAP_DATA } from "../../data/map-data";
import DriverPopup from "./popup-driver";
import StopPopup from "./popup-stop";
import RouteMarker from "./route-marker";

interface IProps {
  steps: StepData[];
  className?: string;
  focusedStop: StepData | null;
  vehicle: RouteData;
}
interface MapRef {
  reactLeafletMap: Map | null;
}
const DriverMap = forwardRef<MapRef, IProps>(
  ({ steps, vehicle, className }, ref) => {
    const mapRef = useRef<Map>(null);

    useImperativeHandle(ref, () => ({
      reactLeafletMap: mapRef.current,
    }));

    const params = {
      mapRef: mapRef.current!,
      driverEnabled: true,
      constantUserTracking: true,
    };

    const { convertToGeoJSON, currentLocation, flyToCurrentLocation } =
      useMap(params);

    const driverRoute = useDriverRoute((state) => state);

    return (
      <div className={cn(className, "z-0 flex w-full flex-col max-lg:grow")}>
        <MapContainer
          ref={mapRef}
          center={MAP_DATA.center}
          zoom={MAP_DATA.zoom}
          doubleClickZoom={MAP_DATA.doubleClickZoom}
          maxBounds={MAP_DATA.maxBounds}
          minZoom={MAP_DATA.minZoom}
          style={MAP_DATA.style}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />
          <Button
            className="absolute bottom-3 right-3 z-[1000]"
            onClick={flyToCurrentLocation}
          >
            Center to Location
          </Button>

          {currentLocation && (
            <RouteMarker
              id={0}
              variant="currentPosition"
              position={[currentLocation.latitude!, currentLocation.longitude!]}
              color={3}
            >
              Current Location
              <Circle
                center={
                  [
                    currentLocation.latitude!,
                    currentLocation.longitude!,
                  ] as LatLngExpression
                }
                radius={currentLocation?.accuracy}
                color="blue"
              />
            </RouteMarker>
          )}

          {steps
            ?.filter((step: StepData) => step.type !== "break")
            .map((step: StepData, index: number) => (
              <RouteMarker
                id={step?.id ?? 0}
                stopId={index}
                variant={step.type === "job" ? "stop" : "car"}
                key={index}
                position={
                  [step?.location?.[1] ?? 0, step?.location?.[0] ?? 0] as [
                    number,
                    number
                  ]
                }
                color={vehicle.vehicle}
                onClick={
                  step.type === "job"
                    ? () => driverRoute.setSelectedStop(step)
                    : () => null
                }
              >
                {step.type === "job" ? (
                  <StopPopup step={step} />
                ) : (
                  <DriverPopup route={vehicle} />
                )}
              </RouteMarker>
            ))}

          <GeoJSON
            data={convertToGeoJSON(null, vehicle.geometry, vehicle.vehicle)}
            style={getStyle}
          />
        </MapContainer>
      </div>
    );
  }
);
DriverMap.displayName = "DriverMap";
export default DriverMap;
