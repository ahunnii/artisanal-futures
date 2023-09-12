import type { Map } from "leaflet";
import L, { type LatLngExpression } from "leaflet";
import { GoogleProvider } from "leaflet-geosearch";
import { useCallback, useEffect, useRef, useState } from "react";
import CarMarker from "~/components/tools/routing/atoms/map/CarMarker";
import { env } from "~/env.mjs";
import { useRequestStore, useRouteStore } from "~/store";
import { getStyle, getUniqueKey } from "~/utils/routing";

import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import type { CalculatedVehicleData, GeoJsonData } from "~/types";
import MapSearch from "../atoms/map/MapSearch";
import StopMarker from "../atoms/map/StopMarker";

type FilteredLocation = {
  job_id: number;
  vehicle_id: number;
};

const RoutingMap = () => {
  const drivers = useRouteStore((state) => state.drivers);
  const locations = useRouteStore((state) => state.locations);
  const mapRef = useRef<Map>(null);
  const optimization = useRequestStore((state) => state.optimization);
  const cachedOptimizations = useRequestStore(
    (state) => state.cachedOptimizations
  );
  const [geojsonData, setGeojsonData] = useState<GeoJsonData[] | null>();
  const setOptimization = useRequestStore((state) => state.setOptimization);

  const [filteredLocations, setFilteredLocations] = useState<
    FilteredLocation[]
  >([]);

  const mapJobsToVehicles = useCallback(
    (optimizationObjects: Array<CalculatedVehicleData>) => {
      const result = [];
      for (const obj of optimizationObjects) {
        const vehicleId = obj.vehicle;
        for (const step of obj.steps) {
          if (step.type === "job" && step.id !== undefined) {
            const jobId = step.id;
            result.push({ job_id: jobId, vehicle_id: vehicleId });
          }
        }
      }
      return result;
    },
    []
  );

  //Recalculate the bounds of the current map
  useEffect(() => {
    if (
      ((locations && locations.length > 0) ||
        (drivers && drivers.length > 0)) &&
      mapRef.current
    ) {
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
    }
    setGeojsonData(null);
    setOptimization(null);
  }, [locations, drivers, setOptimization]);

  //Update displayed geometry from optimization request
  useEffect(() => {
    setFilteredLocations([]);
    if (optimization)
      getUniqueKey({ locations, drivers })
        .then((data) => {
          setFilteredLocations(
            mapJobsToVehicles(
              cachedOptimizations.get(data)?.data
                .routes as Array<CalculatedVehicleData>
            )
          );
          setGeojsonData(
            cachedOptimizations.get(data)?.geometry as GeoJsonData[]
          );
        })
        .catch((err) => {
          console.log(err);
        });
  }, [
    cachedOptimizations,
    drivers,
    locations,
    mapJobsToVehicles,
    optimization,
  ]);
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
      {locations &&
        locations.length > 0 &&
        locations.map((location) => (
          <StopMarker
            position={[
              location.coordinates?.latitude as number,
              location.coordinates?.longitude as number,
            ]}
            name={location?.address}
            key={location?.address}
            id={location.id}
            colorMapping={
              filteredLocations.find(
                (item: { job_id: number; vehicle_id: number }) =>
                  location.id === item.job_id
              )?.vehicle_id ?? 1
            }
          />
        ))}
      {drivers &&
        drivers.length > 0 &&
        drivers.map((vehicle) => (
          <CarMarker
            position={[
              vehicle.coordinates?.latitude as number,
              vehicle.coordinates?.longitude as number,
            ]}
            name={vehicle.address}
            vehicle={vehicle}
            key={vehicle.address}
          />
        ))}{" "}
      <MapSearch
        provider={
          new GoogleProvider({
            apiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
          })
        }
      />
      {geojsonData && <GeoJSON data={geojsonData} style={getStyle} />}
    </MapContainer>
  );
};

export default RoutingMap;