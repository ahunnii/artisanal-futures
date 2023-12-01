import type { Map } from "leaflet";
import { type LatLngExpression } from "leaflet";
import { forwardRef, useImperativeHandle, useRef } from "react";

import { getStyle } from "~/utils/routing/color-handling";

import { Circle, GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import useMap from "~/hooks/routing/use-map";

import { cn } from "~/utils/styles";
import type { RouteData, StepData } from "../types";
import DriverPopup from "./driver-popup";
import RouteMarker from "./route-marker";
import StopPopup from "./stop-popup";

interface IProps {
  steps: StepData[];
  className?: string;
  focusedStop: StepData | null;
  vehicle: RouteData;
}
interface MapRef {
  reactLeafletMap: Map | null;
}
const TempMap = forwardRef<MapRef, IProps>(
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

    const { convertToGeoJSON, currentLocation } = useMap(params);

    return (
      <div className={cn(className, "z-0 flex w-full flex-col max-lg:grow")}>
        <MapContainer
          ref={mapRef}
          center={[42.279594, -83.732124]}
          zoom={15}
          doubleClickZoom={false}
          maxBounds={[
            [40.70462625, -91.6624658],
            [49.29755475, -80.8782742],
          ]}
          minZoom={6.5}
          style={{
            height: "100%",
            width: "100%",
            zIndex: -1,
          }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />

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
              >
                {step.type === "job" ? (
                  <StopPopup step={step} />
                ) : (
                  <DriverPopup route={vehicle} />
                )}
              </RouteMarker>
            ))}
          {
            <GeoJSON
              data={convertToGeoJSON(null, vehicle.geometry, vehicle.vehicle)}
              style={getStyle}
            />
          }
        </MapContainer>
      </div>
    );
  }
);
TempMap.displayName = "TempMap";
export default TempMap;
