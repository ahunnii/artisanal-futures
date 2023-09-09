import type { Map } from "leaflet";
import L, { type LatLngExpression } from "leaflet";
import { GoogleProvider } from "leaflet-geosearch";
import { FC, useCallback, useEffect, useMemo, useRef, useState } from "react";
import CarMarker from "~/components/tools/routing/atoms/map/CarMarker";
import { env } from "~/env.mjs";
import { useRequestStore, useRouteStore } from "~/store";
import { getStyle, getUniqueKey } from "~/utils/routing";

import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import type {
  CalculatedStep,
  CalculatedVehicleData,
  GeoJsonData,
} from "~/types";
import MapSearch from "../atoms/map/MapSearch";
import StopMarker from "../atoms/map/StopMarker";

type FilteredLocation = {
  job_id: number;
  vehicle_id: number;
};

interface IProps {
  steps: CalculatedStep[];
  geojson: GeoJsonData;
}

const TempMap: FC<IProps> = ({ steps, geojson }) => {
  const mapRef = useRef<Map>(null);
  const [bounds, setBounds] = useState<LatLngExpression[] | null>(null);

  useEffect(() => {
    if (steps) {
      const temp = L.latLngBounds(
        steps
          .filter((step: CalculatedStep) => step.type !== "break")
          .map((step: CalculatedStep) => [step.location[1], step.location[0]])
      );
      setBounds(temp);
    }
  }, [steps]);

  //Recalculate the bounds of the current map
  useEffect(() => {
    if (bounds && mapRef.current) {
      const increasedBounds = bounds.pad(0.15);
      mapRef.current.fitBounds(increasedBounds);
      mapRef.current.getBoundsZoom(increasedBounds);
    }
  }, [bounds]);

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
      {<GeoJSON data={geojson} style={getStyle} />}
    </MapContainer>
  );
};

export default TempMap;
