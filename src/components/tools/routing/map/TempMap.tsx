import polyline from "@mapbox/polyline";
import type { LatLngBounds, Map } from "leaflet";
import L, { type LatLngExpression } from "leaflet";
import { useEffect, useMemo, useRef, useState, type FC } from "react";

import { getStyle } from "~/utils/routing";

import { Circle, GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import type { GeoJsonData, Polyline, StepData } from "../types";
import RouteMarker from "./route-marker";

interface IProps {
  steps: StepData[];
  geometry: string;
  focusedStop: StepData | null;
}

const TempMap: FC<IProps> = ({ steps, geometry, focusedStop }) => {
  // const {
  //   currentLocation,
  //   getActiveUsers,
  //   pusherLocations,
  //   triggerActiveUser,
  // } = useTracking();
  const mapRef = useRef<Map>(null);
  const [bounds, setBounds] = useState<LatLngBounds | null>(null);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: 0,
    longitude: 0,
    accuracy: 0,
  });

  useEffect(() => {
    if (steps) {
      const stepMap = steps
        .filter((step: StepData) => step.type !== "break")
        .map((step: StepData) => [
          step?.location?.[1] ?? 0,
          step?.location?.[0] ?? 0,
        ]);

      const totalBounds = [
        ...stepMap,
        [currentLocation.latitude, currentLocation.longitude],
      ];
      const temp = L.latLngBounds(totalBounds as LatLngExpression[]);
      setBounds(temp);
    }
  }, [steps, currentLocation]);

  //Recalculate the bounds of the current map
  useEffect(() => {
    if (bounds && mapRef.current) {
      const increasedBounds = bounds.pad(0.15);
      mapRef.current.fitBounds(increasedBounds);
      mapRef.current.getBoundsZoom(increasedBounds);
    }
  }, [bounds]);

  useEffect(() => {
    // if (!currentLocation && mapRef.current) {
    getCurrentLocation();
  }, []);

  const geoJson = useMemo(() => {
    const temp = polyline.toGeoJSON(geometry) as Polyline;

    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: {
            ...temp,
            properties: { color: 3 },
          },
        },
      ],
    };
  }, [geometry]);

  useEffect(() => {
    if (focusedStop && mapRef.current) {
      mapRef.current.flyTo(
        [focusedStop.location[1], focusedStop.location[0]],
        15
      );
    }
  }, [focusedStop, mapRef]);

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support the geolocation feature!");
      return;
    }

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude, accuracy } = position.coords;
      setCurrentLocation({ latitude, longitude, accuracy });
    });
  };

  return (
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
          position={[currentLocation?.latitude, currentLocation?.longitude]}
          color={3}
        >
          Current Location
          <Circle
            center={
              [
                currentLocation?.latitude,
                currentLocation?.longitude,
              ] as LatLngExpression
            }
            radius={currentLocation?.accuracy}
            color="blue"
          />
        </RouteMarker>
      )}

      {steps &&
        steps.length > 0 &&
        steps
          .filter((step: StepData) => step.type !== "break")
          .map((step: StepData, index: number) => {
            const {
              name: fulfillmentClient,
              address: fulfillmentAddress,

              description: fulfillmentDescription,
            } = JSON.parse(step.description ?? "{}");

            if (step.type === "job")
              return (
                <RouteMarker
                  id={step?.id ?? 0}
                  stopId={index}
                  variant="stop"
                  key={index}
                  position={
                    [step?.location?.[1] ?? 0, step?.location?.[0] ?? 0] as [
                      number,
                      number
                    ]
                  }
                  color={3}
                >
                  <div className="flex flex-col space-y-2">
                    <span className="block text-base font-bold  capitalize ">
                      {fulfillmentClient ?? "Fullfillment Location "}
                    </span>
                    <span className="block">
                      {" "}
                      <span className="block font-semibold text-slate-600">
                        Fulfillment Location
                      </span>
                      {fulfillmentAddress}
                    </span>

                    <span className=" block">
                      {" "}
                      <span className="block font-semibold text-slate-600">
                        Fulfillment Details
                      </span>
                      {fulfillmentDescription === ""
                        ? "Not filled out"
                        : fulfillmentDescription}
                    </span>
                  </div>
                </RouteMarker>
              );
            else
              return (
                <RouteMarker
                  id={step?.id ?? 0}
                  key={index}
                  variant="car"
                  position={
                    [step?.location?.[1] ?? 0, step?.location?.[0] ?? 0] as [
                      number,
                      number
                    ]
                  }
                  color={3}
                >
                  <div className="flex flex-col">
                    {/* <span>{vehicle?.name ?? "Driver"}</span>
                  <span>{vehicle?.address ?? "Start and End Location"}</span> */}
                  </div>
                </RouteMarker>
              );
          })}
      {<GeoJSON data={geoJson as GeoJsonData} style={getStyle} />}
    </MapContainer>
  );
};

export default TempMap;
