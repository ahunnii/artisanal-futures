import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
  type MouseEventHandler,
} from "react";

import {
  Circle,
  GeoJSON,
  LayersControl,
  LayerGroup as LeafletLayerGroup,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import L, { type LatLngExpression, type Map } from "leaflet";
import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";

import DriverPopup from "~/components/tools/routing/map/driver-popup";
import RouteMarker from "~/components/tools/routing/map/route-marker";
import StopPopup from "~/components/tools/routing/map/stop-popup";

import type {
  GeoJsonData,
  Polyline,
  Stop,
} from "~/components/tools/routing/types";

import { useDrivers } from "~/hooks/routing/use-drivers";
import useRouteOptimization from "~/hooks/routing/use-route-optimization";
import { useRoutingSolutions } from "~/hooks/routing/use-routing-solutions";
import { useStops } from "~/hooks/routing/use-stops";

import { Button } from "~/components/ui/button";
import useMap from "~/hooks/routing/use-map";
import { getStyle } from "~/utils/routing/color-handling";
import { cn } from "~/utils/styles";

interface MapProps {
  className?: string;
}

interface MapRef {
  reactLeafletMap: Map | null;
}

type AssignedLocation = Stop & {
  isUnassigned?: boolean;
};

type IdCluster = { job_id: number; vehicle_id: number };

const RoutingMap = forwardRef<MapRef, MapProps>(({ className }, ref) => {
  const mapRef = useRef<Map>(null);

  const params = {
    mapRef: mapRef.current!,
    trackingEnabled: true,
    constantUserTracking: true,
  };

  const { convertSolutionToGeoJSON, flyToCurrentLocation, currentLocation } =
    useMap(params);
  const [latLng, setLatLng] = useState<L.LatLng | null>(null);

  const { drivers, addDriverByLatLng } = useDrivers((state) => state);
  const { locations, addLocationByLatLng } = useStops((state) => state);
  const { currentRoutingSolution } = useRoutingSolutions();
  const { filteredLocations } = useRouteOptimization();

  // Filter through current stops and mark if the optimized route has assigned it to a vehicle or not
  const assignedLocations = locations.map((stop) => {
    return {
      ...stop,
      isUnassigned:
        currentRoutingSolution &&
        !filteredLocations.some(
          (filteredLocation) => filteredLocation.job_id === stop.id
        ),
    } as AssignedLocation;
  });

  useImperativeHandle(ref, () => ({
    reactLeafletMap: mapRef.current,
  }));

  const handleRightClick = (event: MouseEvent) => {
    if (!mapRef.current) return;
    setLatLng(mapRef.current.mouseEventToLatLng(event));
  };

  const findVehicleId = (stop: Stop) =>
    filteredLocations.find((item: IdCluster) => stop.id === item.job_id)
      ?.vehicle_id;

  return (
    <ContextMenu>
      <ContextMenuTrigger
        className={cn(className, "z-0 flex w-full flex-col max-lg:grow")}
        onContextMenu={
          handleRightClick as unknown as MouseEventHandler<HTMLDivElement>
        }
      >
        {" "}
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
            zIndex: 0,
          }}
          className={"relative"}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
          />

          <Button
            className="absolute bottom-3 right-3 z-[1000]"
            onClick={flyToCurrentLocation}
          >
            Center to Location
          </Button>

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
          <LayersControl position="topright">
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
                      <DriverPopup vehicle={vehicle} />
                    </RouteMarker>
                  ))}{" "}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Stops" checked>
              <LeafletLayerGroup>
                {assignedLocations?.length > 0 ? (
                  <>
                    {assignedLocations?.map((location, idx) => {
                      const position = [
                        location.coordinates?.latitude,
                        location.coordinates?.longitude,
                      ] as [number, number];

                      const color =
                        (location?.isUnassigned
                          ? -1
                          : findVehicleId(location)) ?? 1;

                      return (
                        <RouteMarker
                          key={idx}
                          variant="stop"
                          id={location.id}
                          position={position}
                          color={color}
                        >
                          <StopPopup stop={location} />
                        </RouteMarker>
                      );
                    })}
                  </>
                ) : (
                  locations?.length > 0 &&
                  locations.map((location, idx) => {
                    const position = [
                      location.coordinates?.latitude,
                      location.coordinates?.longitude,
                    ] as [number, number];

                    const color = findVehicleId(location) ?? 3;

                    return (
                      <RouteMarker
                        key={idx}
                        variant="stop"
                        id={location.id}
                        position={position}
                        color={color}
                      >
                        <StopPopup stop={location} />
                      </RouteMarker>
                    );
                  })
                )}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
          </LayersControl>

          {currentRoutingSolution && (
            <GeoJSON
              data={
                convertSolutionToGeoJSON(currentRoutingSolution) as GeoJsonData
              }
              style={getStyle}
            />
          )}
        </MapContainer>
      </ContextMenuTrigger>

      {latLng && (
        <ContextMenuContent className="z-50">
          <ContextMenuLabel>
            {latLng?.lat ?? 0}, {latLng?.lng ?? 0}
          </ContextMenuLabel>
          <ContextMenuItem
            onClick={() => {
              addLocationByLatLng(latLng?.lat, latLng?.lng);
            }}
          >
            Add as Stop
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() => addDriverByLatLng(latLng?.lat, latLng?.lng)}
          >
            Add as Driver
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
});
RoutingMap.displayName = "RoutingMap";
export default RoutingMap;
