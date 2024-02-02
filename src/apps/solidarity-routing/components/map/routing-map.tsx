import {
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEventHandler,
} from "react";

import type L from "leaflet";
import type { LatLngExpression, Map } from "leaflet";
import {
  Circle,
  GeoJSON,
  LayersControl,
  LayerGroup as LeafletLayerGroup,
  MapContainer,
  TileLayer,
} from "react-leaflet";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import { Button } from "~/components/ui/button";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";

import DriverPopup from "~/apps/solidarity-routing/components/map/popup-driver";
import StopPopup from "~/apps/solidarity-routing/components/map/popup-stop";
import RouteMarker from "~/apps/solidarity-routing/components/map/route-marker";
import { useDrivers } from "~/apps/solidarity-routing/hooks/drivers/use-drivers";
import useMap from "~/apps/solidarity-routing/hooks/use-map";
import useRouteOptimization from "~/apps/solidarity-routing/hooks/use-route-optimization";
import { useRoutingSolutions } from "~/apps/solidarity-routing/hooks/use-routing-solutions";
import { useStops } from "~/apps/solidarity-routing/hooks/use-stops";
import { getStyle } from "~/apps/solidarity-routing/libs/color-handling";
import type { GeoJsonData, Stop } from "~/apps/solidarity-routing/types";

import { cn } from "~/utils/styles";
import { MAP_DATA } from "../../data/map-data";

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
          center={MAP_DATA.center}
          zoom={MAP_DATA.zoom}
          doubleClickZoom={MAP_DATA.doubleClickZoom}
          maxBounds={MAP_DATA.maxBounds}
          minZoom={MAP_DATA.minZoom}
          style={MAP_DATA.style}
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
