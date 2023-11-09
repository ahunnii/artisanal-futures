/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { LatLngExpression, Map } from "leaflet";

import { useCallback, useEffect, useRef, type FC } from "react";
import { MapContainer, TileLayer } from "react-leaflet";

import { convertSecondsToTimeString } from "~/utils/routing/data-formatting";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import {
  GeoJSON,
  LayersControl,
  LayerGroup as LeafletLayerGroup,
} from "react-leaflet";

import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import type {
  GeoJsonData,
  Polyline,
  PusherUserData,
  RouteData,
} from "../types";

import polyline from "@mapbox/polyline";
import L from "leaflet";
import { getStyle } from "~/utils/routing/color-handling";
import RouteMarker from "./route-marker";

interface TrackingMapProps {
  activeUsers: PusherUserData[];
  currentRoutes: RouteData[];
  selectedRoute: RouteData | null;
}
const TrackingMap: FC<TrackingMapProps> = ({
  activeUsers,
  currentRoutes,
  selectedRoute,
}) => {
  const mapRef = useRef<Map>(null);

  useEffect(() => {
    if (mapRef.current && selectedRoute) {
      const stepCoordinates = selectedRoute?.steps
        ?.filter((step) => step.type !== "break")
        .map(
          (step) => [step?.location[1], step?.location[0]] as LatLngExpression
        );

      if (stepCoordinates.length === 0) return;
      const bounds = L.latLngBounds(stepCoordinates);

      mapRef.current.fitBounds(bounds);
    }
  }, [selectedRoute, mapRef]);

  useEffect(() => {
    if (mapRef.current && currentRoutes) {
      const allSteps = currentRoutes.map((route) => route?.steps);
      const stepCoordinates = allSteps
        .flat(1)
        ?.filter((step) => step.type !== "break")
        .map(
          (step) => [step?.location[1], step?.location[0]] as LatLngExpression
        );

      if (stepCoordinates.length === 0) return;
      const bounds = L.latLngBounds(stepCoordinates);

      mapRef.current.fitBounds(bounds);
    }
  }, [currentRoutes, mapRef]);

  const convertToGeoJson = useCallback((geometry: string, color: number) => {
    const temp = polyline.toGeoJSON(geometry) as Polyline;

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            ...temp,
            properties: { color },
          },
        },
      ],
    };
  }, []);

  return (
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
        {" "}
        <LayersControl.Overlay name="Drivers" checked>
          <LeafletLayerGroup>
            {activeUsers?.length &&
              activeUsers.map((vehicle, idx) => {
                const { name } = JSON.parse(
                  vehicle?.route?.description ?? "{}"
                );

                const startTime = convertSecondsToTimeString(
                  vehicle?.route?.steps?.[0]?.arrival ?? 0
                );
                const endTime = convertSecondsToTimeString(
                  (vehicle?.route?.steps?.[0]?.arrival ?? 0) +
                    vehicle?.route?.setup +
                    vehicle?.route?.service +
                    vehicle?.route?.waiting_time +
                    vehicle?.route?.duration
                );
                const numberOfStops = vehicle?.route?.steps?.filter(
                  (step) => step.type === "job"
                ).length;

                return (
                  <RouteMarker
                    key={idx}
                    variant="car"
                    id={idx}
                    position={[vehicle.latitude, vehicle.longitude]}
                    color={idx}
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="block text-base font-bold capitalize">
                        {name ?? "Driver "}
                      </span>
                      <span className="block">
                        <span className="block font-semibold text-slate-600">
                          Route Details
                        </span>
                        Start {startTime} • End {endTime} • {numberOfStops}{" "}
                        stops • {convertMetersToMiles(vehicle?.route?.distance)}{" "}
                        miles
                      </span>
                    </div>
                  </RouteMarker>
                );
              })}{" "}
          </LeafletLayerGroup>
        </LayersControl.Overlay>{" "}
        {currentRoutes?.length > 0 &&
          currentRoutes.map((route, idx) => {
            const { name: driverName } = JSON.parse(route?.description ?? "{}");
            return (
              <LayersControl.Overlay name={driverName} checked key={idx}>
                <LeafletLayerGroup>
                  {" "}
                  <>
                    {route?.steps?.length &&
                      route?.steps
                        ?.filter((step) => step.type !== "break")
                        .map((stop, index) => {
                          const { name, address, description } = JSON.parse(
                            stop?.description ?? "{}"
                          );

                          return (
                            <RouteMarker
                              key={index}
                              variant="stop"
                              id={index}
                              position={[stop?.location[1], stop?.location[0]]}
                              color={idx}
                            >
                              <div className="flex flex-col space-y-2">
                                <span className="block text-base font-bold capitalize ">
                                  {name ?? "Fulfillment "}
                                </span>
                                <span className="block">
                                  {" "}
                                  <span className="block font-semibold text-slate-600">
                                    Fulfillment Location
                                  </span>
                                  {address}
                                </span>

                                <span className=" block">
                                  {" "}
                                  <span className="block font-semibold text-slate-600">
                                    Fulfillment Details
                                  </span>
                                  {description === ""
                                    ? "Not filled out"
                                    : description}
                                </span>
                              </div>
                            </RouteMarker>
                          );
                        })}{" "}
                    <GeoJSON
                      data={
                        convertToGeoJson(route?.geometry, idx) as GeoJsonData
                      }
                      style={getStyle}
                    />
                  </>
                </LeafletLayerGroup>
              </LayersControl.Overlay>
            );
          })}
      </LayersControl>
    </MapContainer>
  );
};

export default TrackingMap;
