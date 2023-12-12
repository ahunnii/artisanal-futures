import type { Map } from "leaflet";

import { forwardRef, useImperativeHandle, useRef } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import {
  GeoJSON,
  LayersControl,
  LayerGroup as LeafletLayerGroup,
} from "react-leaflet";

import type { PusherUserData } from "../types";

import { useDepot } from "~/hooks/routing/use-depot";
import useMap from "~/hooks/routing/use-map";
import { getStyle } from "~/utils/routing/color-handling";
import { cn } from "~/utils/styles";
import DepotPopup from "./depot-popup";
import DriverPopup from "./driver-popup";
import RouteMarker from "./route-marker";
import StopPopup from "./stop-popup";

interface TrackingMapProps {
  activeUsers: PusherUserData[];
  className?: string;
}

interface MapRef {
  reactLeafletMap: Map | null;
}

const TrackingMap = forwardRef<MapRef, TrackingMapProps>(
  ({ activeUsers, className }, ref) => {
    const mapRef = useRef<Map>(null);

    const params = {
      mapRef: mapRef.current!,
      trackingEnabled: true,
    };

    const { routes } = useDepot((state) => state);

    const { convertToGeoJSON } = useMap(params);

    useImperativeHandle(ref, () => ({
      reactLeafletMap: mapRef.current,
    }));

    return (
      <div className={cn(className, "z-0 flex w-full flex-col max-lg:grow")}>
        <MapContainer
          ref={mapRef}
          center={[42.331429, -83.045753]}
          zoom={12}
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

          <LayersControl position="topright">
            <LayersControl.Overlay name="Drivers" checked>
              <LeafletLayerGroup>
                {activeUsers.map((vehicle, idx) => (
                  <RouteMarker
                    key={idx}
                    variant="car"
                    id={idx}
                    position={[vehicle.latitude, vehicle.longitude]}
                    color={vehicle?.route?.vehicle}
                  >
                    <DriverPopup route={vehicle?.route} />
                  </RouteMarker>
                ))}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
            {routes.map((route, idx) => {
              const { name } = JSON.parse(route?.description ?? "{}");
              return (
                <LayersControl.Overlay name={name} checked key={idx}>
                  <LeafletLayerGroup>
                    <>
                      {route?.steps?.length &&
                        route?.steps
                          ?.filter((step) => step.type !== "break")
                          .map((stop, index) => {
                            const position = [
                              stop?.location?.[1] ?? 0,
                              stop?.location?.[0] ?? 0,
                            ] as [number, number];

                            return (
                              <RouteMarker
                                id={stop?.id ?? 0}
                                key={index}
                                variant={stop.type === "job" ? "stop" : "depot"}
                                position={position}
                                color={route?.vehicle}
                              >
                                {stop.type === "job" ? (
                                  <StopPopup step={stop} />
                                ) : (
                                  <DepotPopup route={route} />
                                )}
                              </RouteMarker>
                            );
                          })}
                      <GeoJSON
                        data={convertToGeoJSON(route)}
                        style={getStyle}
                      />
                    </>
                  </LeafletLayerGroup>
                </LayersControl.Overlay>
              );
            })}
          </LayersControl>
        </MapContainer>
      </div>
    );
  }
);
TrackingMap.displayName = "TrackingMap";

export default TrackingMap;
