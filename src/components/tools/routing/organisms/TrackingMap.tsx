/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Map } from "leaflet";
import L, { divIcon, type LatLngExpression } from "leaflet";
import { GoogleProvider } from "leaflet-geosearch";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { GeoJSON, MapContainer, TileLayer } from "react-leaflet";
import { v4 as uuid } from "uuid";
import CarMarker from "~/components/tools/routing/atoms/map/CarMarker";
import { env } from "~/env.mjs";
import { useRequestStore, useRouteStore } from "~/store";
import { getStyle, getUniqueKey } from "~/utils/routing";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import type { CalculatedVehicleData, GeoJsonData } from "~/types";
import { getColor } from "~/utils/routing";
import MapSearch from "../atoms/map/MapSearch";
import StopMarker from "../atoms/map/StopMarker";

type FilteredLocation = {
  job_id: number;
  vehicle_id: number;
};

type CachedOptimization = {
  geometry: any;
  data: any;
};
interface MarkerProps {
  colorMapping: number;
}

const RoutingMap = () => {
  const [marker, setMarker] = useState<L.Marker | null>(null);
  const [circle, setCircle] = useState<L.Circle | null>(null);

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
  const trackingMarker = ({ colorMapping }: MarkerProps) => {
    const color = getColor(colorMapping).fill!;

    const markerHtmlStyles = `
          background-color: ${color ?? "#6366f1"};
          width: 2rem;
          height: 2rem;
          display: block;
          left: -0.5rem;
          top: -0.5rem;
          position: relative;
          border-radius: 3rem 3rem 0;
          transform: rotate(45deg); 
      box-shadow: 0 0 #0000, 0 0 #0000, 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1);
          border: 3px solid #FFFFFF`;

    const icon = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${markerHtmlStyles}" />`,
    });

    return icon;
  };
  useEffect(() => {
    if (!navigator.geolocation) {
      console.log("Your browser doesn't support the geolocation feature!");
      return;
    }

    const intervalId = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        if (marker) {
          marker.remove();
        }
        if (circle) {
          circle.remove();
        }

        const newMarker = L.marker([lat, long], {
          icon: trackingMarker({
            colorMapping: 0,
          }),
        });
        const newCircle = L.circle([lat, long], { radius: accuracy });

        setMarker(newMarker);
        setCircle(newCircle);

        const featureGroup = L.featureGroup([newMarker, newCircle]).addTo(
          mapRef.current!
        );

        mapRef.current!.fitBounds(featureGroup.getBounds());

        console.log(
          `Your coordinate is: Lat: ${lat} Long: ${long} Accuracy: ${accuracy}`
        );
      });
    }, 5000);

    return () => {
      clearInterval(intervalId);
    };
  }, [marker, circle]);

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
              (cachedOptimizations.get(data) as CachedOptimization)?.data
                .routes as Array<CalculatedVehicleData>
            )
          );
          setGeojsonData(
            (cachedOptimizations.get(data) as CachedOptimization)
              ?.geometry as GeoJsonData[]
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
      {locations &&
        locations.length > 0 &&
        locations.map((location, idx) => (
          <StopMarker
            position={[
              location.coordinates?.latitude as number,
              location.coordinates?.longitude as number,
            ]}
            name={location?.address}
            key={idx}
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
        drivers.map((vehicle, idx) => (
          <CarMarker
            position={[
              vehicle.coordinates?.latitude as number,
              vehicle.coordinates?.longitude as number,
            ]}
            name={vehicle.address}
            vehicle={vehicle}
            key={idx}
          />
        ))}{" "}
      <MapSearch
        provider={
          new GoogleProvider({
            apiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
          })
        }
      />
      {/* @ts-ignore */}
      {geojsonData && <GeoJSON data={geojsonData} style={getStyle} />}
    </MapContainer>
  );
};

export default RoutingMap;
