import L, { type LatLngExpression, type Map } from "leaflet";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
} from "react";
import {
  GeoJSON,
  LayersControl,
  LayerGroup as LeafletLayerGroup,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import { getStyle } from "~/utils/routing";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { useDrivers } from "~/hooks/routing/use-drivers";
import useRouteOptimization from "~/hooks/routing/use-route-optimization";
import { useRoutingSolutions } from "~/hooks/routing/use-routing-solutions";
import { useStops } from "~/hooks/routing/use-stops";
import type { GeoJsonData, Polyline } from "../types";
import RouteMarker from "./route-marker";

interface MapProps {
  className?: string;
  test?: string;
}

interface MapRef {
  reactLeafletMap: Map | null;
}

const RoutingMap = forwardRef<MapRef, MapProps>(
  ({ className, ...props }, ref) => {
    const drivers = useDrivers((state) => state.drivers);
    const locations = useStops((state) => state.locations);
    const { currentRoutingSolution } = useRoutingSolutions();
    const { filteredLocations, invalidateRoutes } = useRouteOptimization();

    const assignedLocations = locations.filter((stop) =>
      filteredLocations.some(
        (filteredLocation) => filteredLocation.job_id === stop.id
      )
    );
    const unassignedLocations = locations.filter(
      (stop) =>
        !filteredLocations.some(
          (filteredLocation) => filteredLocation.job_id === stop.id
        )
    );

    const mapRef = useRef<Map>(null);

    useImperativeHandle(ref, () => ({
      reactLeafletMap: mapRef.current,
    }));

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
      invalidateRoutes();
    }, [locations, drivers]);

    const geoJson = useMemo(() => {
      return {
        type: "FeatureCollection",
        features: currentRoutingSolution?.geometry.map((geometry: Polyline) => {
          return {
            type: "Feature",
            geometry,
          };
        }),
      };
    }, [currentRoutingSolution?.geometry]);

    return (
      <MapContainer
        ref={mapRef}
        center={[42.33085782908872, -83.05011192993956]}
        zoom={13}
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
              {drivers?.length &&
                drivers.map((vehicle, idx) => (
                  <RouteMarker
                    key={idx}
                    variant="car"
                    id={vehicle.id}
                    position={[
                      vehicle.coordinates?.latitude,
                      vehicle.coordinates?.longitude,
                    ]}
                    color={vehicle?.id ?? 2}
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="block text-base font-bold capitalize">
                        {vehicle?.name ?? "Driver "}
                      </span>
                      <span className="block">
                        <span className="block font-semibold text-slate-600">
                          Start and End Location
                        </span>
                        {vehicle.address}
                      </span>
                    </div>
                  </RouteMarker>
                ))}{" "}
            </LeafletLayerGroup>
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Stops" checked>
            <LeafletLayerGroup>
              {assignedLocations?.length > 0 ? (
                <>
                  {assignedLocations.map((location, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="stop"
                      id={location.id}
                      position={[
                        location.coordinates?.latitude,
                        location.coordinates?.longitude,
                      ]}
                      color={
                        filteredLocations.find(
                          (item: { job_id: number; vehicle_id: number }) =>
                            location.id === item.job_id
                        )?.vehicle_id ?? 1
                      }
                    >
                      <div className="flex flex-col space-y-2">
                        <span className="block text-base font-bold  capitalize ">
                          {location?.customer_name ?? "Driver "}
                        </span>
                        <span className="block">
                          {" "}
                          <span className="block font-semibold text-slate-600">
                            Fulfillment Location
                          </span>
                          {location.address}
                        </span>

                        <span className=" block">
                          {" "}
                          <span className="block font-semibold text-slate-600">
                            Fulfillment Details
                          </span>
                          {location.description ?? "Not filled out"}
                        </span>
                      </div>
                    </RouteMarker>
                  ))}

                  {unassignedLocations?.map((location, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="stop"
                      id={location.id}
                      position={[
                        location.coordinates?.latitude,
                        location.coordinates?.longitude,
                      ]}
                      color={-1}
                    >
                      <div className="flex flex-col space-y-2">
                        <span className="block text-base font-bold capitalize ">
                          {location?.customer_name ?? "Driver "}
                        </span>
                        <span className="block">
                          {" "}
                          <span className="block font-semibold text-slate-600">
                            Fulfillment Location
                          </span>
                          {location.address}
                        </span>

                        <span className=" block">
                          {" "}
                          <span className="block font-semibold text-slate-600">
                            Fulfillment Details
                          </span>
                          {location.description ?? "Not filled out"}
                        </span>
                      </div>
                    </RouteMarker>
                  ))}
                </>
              ) : (
                locations?.length &&
                locations.map((location, idx) => (
                  <RouteMarker
                    key={idx}
                    variant="stop"
                    id={location.id}
                    position={[
                      location.coordinates?.latitude,
                      location.coordinates?.longitude,
                    ]}
                    color={
                      filteredLocations.find(
                        (item: { job_id: number; vehicle_id: number }) =>
                          location.id === item.job_id
                      )?.vehicle_id ?? 1
                    }
                  >
                    {/* {location.address} {location.id} {location.description} */}

                    <div className="flex flex-col space-y-2">
                      <span className="block text-base font-bold capitalize ">
                        {location?.customer_name ?? "Driver "}
                      </span>
                      <span className="block">
                        {" "}
                        <span className="block font-semibold text-slate-600">
                          Fulfillment Location
                        </span>
                        {location.address}
                      </span>

                      <span className=" block">
                        {" "}
                        <span className="block font-semibold text-slate-600">
                          Fulfillment Details
                        </span>
                        {location.description ?? "Not filled out"}
                      </span>
                    </div>
                  </RouteMarker>
                ))
              )}{" "}
            </LeafletLayerGroup>
          </LayersControl.Overlay>
        </LayersControl>

        {currentRoutingSolution && (
          <GeoJSON data={geoJson as GeoJsonData} style={getStyle} />
        )}
      </MapContainer>
    );
  }
);
RoutingMap.displayName = "RoutingMap";
export default RoutingMap;
