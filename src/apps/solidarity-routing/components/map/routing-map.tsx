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

import useMap from "~/apps/solidarity-routing/hooks/use-map";
import useRouteOptimization from "~/apps/solidarity-routing/hooks/use-route-optimization";
import { useRoutingSolutions } from "~/apps/solidarity-routing/hooks/use-routing-solutions";
import { useStopsStore } from "~/apps/solidarity-routing/hooks/use-stops-store";
import { getStyle } from "~/apps/solidarity-routing/libs/color-handling";
import type { GeoJsonData, Stop } from "~/apps/solidarity-routing/types";

import { cn } from "~/utils/styles";
import { MAP_DATA } from "../../data/map-data";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { ClientJobBundle } from "../../types.wip";
import {
  cuidToNumber,
  cuidToUniqueNumber,
} from "../../utils/generic/format-utils.wip";
import { MapPopup } from "./map-popup.wip";

interface MapProps {
  className?: string;
}

interface MapRef {
  reactLeafletMap: Map | null;
}

type AssignedLocation = ClientJobBundle & {
  isUnassigned?: boolean;
};

type MapPoint = {
  id: string;
  partnerId?: string;
  isAssigned?: boolean;
  type: "vehicle" | "job";
  lat: number;
  lng: number;
  name: string;
  address: string;
};

type IdCluster = { job_id: string; vehicle_id: string };

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

  const drivers = useDriverVehicleBundles();

  const { stops, addStopByLatLng } = useClientJobBundles();

  // const drivers = bundles?.all;
  const addDriverByLatLng = drivers.addByLatLng;

  // const { locations, addLocationByLatLng } = useStopsStore((state) => state);
  const { currentRoutingSolution } = useRoutingSolutions();
  const { filteredLocations } = useRouteOptimization();

  // Filter through current stops and mark if the optimized route has assigned it to a vehicle or not
  const assignedLocations = stops.map((stop) => {
    return {
      ...stop,
      isUnassigned:
        currentRoutingSolution &&
        !filteredLocations.some(
          (filteredLocation) => filteredLocation.job_id === stop.job.id
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

  const findVehicleId = (stop: ClientJobBundle) =>
    filteredLocations.find((item: IdCluster) => stop.job.id === item.job_id)
      ?.vehicle_id;

  const stopMapPoints: MapPoint[] = stops.map((stop) => ({
    id: stop.job.id,
    type: "job",
    lat: stop.job.address.latitude,
    lng: stop.job.address.longitude,
    address: stop.job.address.formatted,
    name: stop.client.name ?? "New Stop",
  }));

  const driverMapPoints: MapPoint[] = drivers?.data?.map((driver) => ({
    id: driver.vehicle.id,
    type: "vehicle",
    lat: driver.vehicle.startAddress?.latitude,
    lng: driver.vehicle.startAddress?.longitude,
    address: driver.vehicle.startAddress?.formatted ?? "",
    name: driver?.driver?.name ?? "Driver",
  }));

  const mapPoints: MapPoint[] = [...stopMapPoints, ...driverMapPoints];

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
              id={"0"}
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
                {driverMapPoints?.length > 0 &&
                  driverMapPoints.map((vehicle, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="car"
                      id={vehicle.id}
                      position={[vehicle.lat, vehicle.lng]}
                      color={cuidToUniqueNumber(vehicle.id)}
                    >
                      <MapPopup
                        name={vehicle.name}
                        address={vehicle.address}
                        type={vehicle.type}
                      />
                    </RouteMarker>
                  ))}{" "}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Stops" checked>
              <LeafletLayerGroup>
                {/* {assignedLocations?.length > 0 ? (
                  <>
                    {assignedLocations?.map((location, idx) => {
                      const position = [
                        location.job?.address?.latitude,
                        location.job?.address?.longitude,
                      ] as [number, number];

                      const color =
                        (location?.isUnassigned
                          ? -1
                          : findVehicleId(location)) ?? 1;

                      return (
                        <RouteMarker
                          key={idx}
                          variant="stop"
                          id={location.job.id}
                          position={position}
                          color={color}
                        >
                          <StopPopup stop={location} />
                        </RouteMarker>
                      );
                    })}
                  </>
                ) : (
                  stops?.length > 0 &&
                  stops.map((location, idx) => {
                    const position = [
                      location.job.address?.latitude,
                      location.job.address?.longitude,
                    ] as [number, number];

                    const color = findVehicleId(location?.job?.id) ?? 3;

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
                )} */}
                {stopMapPoints?.length > 0 &&
                  stopMapPoints.map((stop, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="stop"
                      id={stop.id}
                      position={[stop.lat, stop.lng]}
                      color={3}
                    >
                      <MapPopup
                        name={stop.name}
                        address={stop.address}
                        type={stop.type}
                      />
                    </RouteMarker>
                  ))}{" "}
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
            onClick={() => addStopByLatLng(latLng?.lat, latLng?.lng)}
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
