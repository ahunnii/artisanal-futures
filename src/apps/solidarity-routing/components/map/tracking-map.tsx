import { forwardRef, useImperativeHandle, useRef } from "react";

import type { Map } from "leaflet";
import {
  GeoJSON,
  LayerGroup,
  LayersControl,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import useMap from "~/apps/solidarity-routing/hooks/use-map";
import { getStyle } from "~/apps/solidarity-routing/libs/color-handling";
import type {
  ExpandedRouteData,
  PusherUserData,
  StepData,
} from "~/apps/solidarity-routing/types";

import { api } from "~/utils/api";
import { cn } from "~/utils/styles";

import { MAP_DATA } from "../../data/map-data";
import DepotPopup from "./popup-depot";
import DriverPopup from "./popup-driver";
import StopPopup from "./popup-stop";
import RouteMarker from "./route-marker";

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

    // const { routes } = useDepot((state) => state);

    const { data: routes } =
      api.finalizedRoutes.getAllFormattedFinalizedRoutes.useQuery({
        filterOut: "COMPLETED",
      });

    const { convertToGeoJSON } = useMap(params);

    useImperativeHandle(ref, () => ({
      reactLeafletMap: mapRef.current,
    }));

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

          <LayersControl position="topright">
            <LayersControl.Overlay name="Drivers" checked>
              <LayerGroup>
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
              </LayerGroup>
            </LayersControl.Overlay>
            {routes &&
              routes.length > 0 &&
              routes.map((route, idx) => {
                const { name } = route?.description;
                return (
                  <LayersControl.Overlay name={name} checked key={idx}>
                    <LayerGroup>
                      <>
                        {route?.steps?.length &&
                          route?.steps
                            ?.filter((step: StepData) => step.type !== "break")
                            .map((stop: StepData, index: number) => {
                              const position = [
                                stop?.location?.[1] ?? 0,
                                stop?.location?.[0] ?? 0,
                              ] as [number, number];

                              return (
                                <RouteMarker
                                  id={stop?.id ?? 0}
                                  key={index}
                                  variant={
                                    stop.type === "job" ? "stop" : "depot"
                                  }
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
                          data={convertToGeoJSON(route as ExpandedRouteData)}
                          style={getStyle}
                          key={route.routeId}
                        />
                      </>
                    </LayerGroup>
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
