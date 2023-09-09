import L from "leaflet";
import "leaflet/dist/leaflet.css";

import L, { type LatLngExpression } from "leaflet";
import React, { forwardRef, useEffect, useImperativeHandle } from "react";
import { GeoJSON, MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import type { CalculatedStep, GeoJsonData, LatLngBounds } from "~/types";

// Fix for the default icon URLs
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

export type MapRef = {
  setBounds: (bounds: any) => void;
};

type LazyMapProps = {
  steps: CalculatedStep[];
  initialBounds: LatLngBounds;
  geojson: GeoJsonData;
};

import { getStyle } from "~/utils/routing";
import CarMarker from "../../atoms/map/CarMarker";
import StopMarker from "../../atoms/map/StopMarker";
const LazyMap = forwardRef<MapRef, LazyMapProps>(
  ({ steps, initialBounds, geojson }, ref) => {
    let map: any = null;

    useImperativeHandle(ref, () => ({
      setBounds: (bounds: any) => {
        if (map) {
          map.fitBounds(bounds);
        } else {
          console.error("Map instance is not available!");
        }
      },
    }));

    useEffect(() => {
      const bounds = L.latLngBounds(
        [...locations, ...drivers].map(
          (location) =>
            [
              location?.coordinates?.latitude,
              location?.coordinates?.longitude,
            ] as LatLngExpression
        )
      );
      mapRef.current.fitBounds(bounds);
    }, [steps]);

    return (
      <MapContainer
        center={[42.279594, -83.732124]}
        zoom={15}
        style={{ width: "100%", height: "400px" }}
        maxBounds={[
          [40.70462625, -91.6624658],
          [49.29755475, -80.8782742],
        ]}
        minZoom={6.5}
        whenCreated={(mapInstance) => {
          map = mapInstance;
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* {steps.map((step, index) => (
          <StopMarker
            key={index}
            position={[step.location[1], step.location[0]]}
            name={`Step ${index + 1}`}
            id={step.id}
            colorMapping={index}
          >
            <Popup>{step.description}</Popup>
          </StopMarker>
        ))} */}

        {steps &&
          steps.length > 0 &&
          steps
            .filter((step: any) => step.type !== "break")
            .map((step: any, index: number) => {
              if (step.type === "job")
                return (
                  <StopMarker
                    key={index}
                    position={[step.location[1], step.location[0]]}
                    name={`Step ${index + 1}`}
                    id={step.id}
                    colorMapping={index}
                  />
                );
              else
                return (
                  <CarMarker
                    position={[step.location[1], step.location[0]]}
                    name={`${index}`}
                    key={index}
                  />
                );
            })}
        <GeoJSON data={geojson} style={getStyle} />
      </MapContainer>
    );
  }
);

LazyMap.displayName = "LazyMap";
export default LazyMap;
