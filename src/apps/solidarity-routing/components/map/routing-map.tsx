import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEventHandler,
} from "react";

import type L from "leaflet";
import type { LatLngExpression, Map as LeafletMap } from "leaflet";
import { Expand } from "lucide-react";
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

import RouteMarker from "~/apps/solidarity-routing/components/map/route-marker";

import { getStyle } from "~/apps/solidarity-routing/utils/generic/color-handling";

import useMap from "~/apps/solidarity-routing/hooks/use-map";

import type { GeoJsonData } from "~/apps/solidarity-routing/types";

import { MapPopup } from "~/apps/solidarity-routing/components/map/map-popup.wip";
import { MAP_DATA } from "~/apps/solidarity-routing/data/map-data";
import { useDriverVehicleBundles } from "~/apps/solidarity-routing/hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "~/apps/solidarity-routing/hooks/jobs/use-client-job-bundles";
import { useOptimizedRoutePlan } from "~/apps/solidarity-routing/hooks/optimized-data/use-optimized-route-plan";
import { useSolidarityState } from "~/apps/solidarity-routing/hooks/optimized-data/use-solidarity-state";
import { useRoutePlans } from "~/apps/solidarity-routing/hooks/plans/use-route-plans";
import { formatGeometryString } from "~/apps/solidarity-routing/services/optimization/aws-vroom/utils";
import { cuidToIndex } from "~/apps/solidarity-routing/utils/generic/format-utils.wip";

import { pusherClient } from "~/server/soketi/client";
import { cn } from "~/utils/styles";
import { MapViewButton } from "./map-view-button";

interface MapProps {
  className?: string;
}

interface MapRef {
  reactLeafletMap: LeafletMap | null;
}

export type MapPoint = {
  id: string;
  partnerId?: string;
  isAssigned?: boolean;
  type: "vehicle" | "job";
  lat: number;
  lng: number;
  name: string;
  address: string;
  color: string;
};

type CoordMap = Record<string, { lat: number; lng: number }>;

const RoutingMap = forwardRef<MapRef, MapProps>(({ className }, ref) => {
  const mapRef = useRef<LeafletMap>(null);

  const [enableTracking, setEnableTracking] = useState(false);

  const params = {
    mapRef: mapRef.current!,
    trackingEnabled: true,
    constantUserTracking: enableTracking,
  };

  const {
    expandViewToFit,
    flyToCurrentLocation,
    currentLocation,
    toggleConstantTracking,
    constantTracking,
  } = useMap(params);
  const [latLng, setLatLng] = useState<L.LatLng | null>(null);

  // const activeDrivers = new Map<string, { lat: number; lng: number }>();

  const [activeDrivers, setActiveDrivers] = useState<CoordMap>({});

  const driverBundles = useDriverVehicleBundles();
  const jobBundles = useClientJobBundles();
  const routePlans = useRoutePlans();

  // const drivers = bundles?.all;
  const addDriverByLatLng = driverBundles.createByLatLng;
  const addJobByLatLng = jobBundles.createByLatLng;

  const { pathId } = useSolidarityState();

  const optimizedRoutePlan = useOptimizedRoutePlan();

  useImperativeHandle(ref, () => ({
    reactLeafletMap: mapRef.current,
  }));

  const handleRightClick = (event: MouseEvent) => {
    if (!mapRef.current) return;
    setLatLng(mapRef.current.mouseEventToLatLng(event));
  };

  const stopMapPoints: MapPoint[] = pathId
    ? optimizedRoutePlan.mapData.jobs
    : jobBundles.data.map((stop) => ({
        id: stop.job.id,
        type: "job",
        lat: stop.job.address.latitude,
        lng: stop.job.address.longitude,
        address: stop.job.address.formatted,
        name: stop?.client?.name ?? "New Stop",
        color: !stop.job.isOptimized
          ? "-1"
          : `${cuidToIndex(routePlans.findVehicleIdByJobId(stop.job.id))}`,
      }));

  const driverMapPoints: MapPoint[] = pathId
    ? optimizedRoutePlan.mapData.driver
    : driverBundles?.data?.map((driver) => ({
        id: driver.vehicle.id,
        type: "vehicle",
        lat: driver.vehicle.startAddress?.latitude,
        lng: driver.vehicle.startAddress?.longitude,
        address: driver.vehicle.startAddress?.formatted ?? "",
        name: driver?.driver?.name ?? "Driver",
        color:
          routePlans.optimized.length > 0
            ? `${cuidToIndex(driver.vehicle.id)}`
            : "3",
      }));

  const unassignedMapPoints: MapPoint[] = stopMapPoints.filter(
    (stop) => stop.color === "-1"
  );

  const assignedMapPoints: MapPoint[] = stopMapPoints.filter(
    (stop) => stop.color !== "-1"
  );

  const routeGeoJsonList = pathId
    ? optimizedRoutePlan.mapData.geometry
    : routePlans.optimized.map((route) => {
        return {
          id: route.id,
          geoJson: route.geoJson,
          vehicleId: route.vehicleId,
        };
      });

  useEffect(() => {
    pusherClient.subscribe("map");
    pusherClient.bind("evt::update-location", setActiveDriverIcons);

    return () => {
      pusherClient.unsubscribe("map");
    };
  }, []);

  const setActiveDriverIcons = (obj: {
    vehicleId: string;
    latitude: number;
    longitude: number;
  }) => {
    setActiveDrivers((prevCoordMap) => ({
      ...prevCoordMap,
      [obj.vehicleId]: {
        lat: obj.latitude,
        lng: obj.longitude,
      },
    }));
  };

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

          {mapRef.current && <MapViewButton mapRef={mapRef.current} />}

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

          {activeDrivers &&
            Object.keys(activeDrivers).map((vehicleId) => {
              const latLng = activeDrivers[vehicleId];
              const driver = driverBundles.getVehicleById(vehicleId);

              return (
                <RouteMarker
                  id={"0"}
                  key={vehicleId}
                  variant="car"
                  position={[latLng!.lat, latLng!.lng]}
                  color={cuidToIndex(vehicleId)}
                >
                  <MapPopup
                    name={driver?.driver.name ?? "Driver"}
                    address={driver?.driver?.address?.formatted ?? ""}
                  />
                </RouteMarker>
              );
            })}
          <LayersControl position="topright">
            <LayersControl.Overlay name="Drivers" checked>
              <LeafletLayerGroup>
                {driverMapPoints?.length > 0 &&
                  driverMapPoints.map((vehicle, idx) => {
                    const latLng: [number, number] = [vehicle.lat, vehicle.lng];

                    const isActive = activeDrivers[vehicle.id];

                    return (
                      <RouteMarker
                        key={idx}
                        variant={isActive ? "depot" : "car"}
                        id={vehicle.id}
                        position={latLng}
                        color={Number(vehicle.color)}
                      >
                        <MapPopup
                          name={vehicle.name}
                          address={vehicle.address}
                        />
                      </RouteMarker>
                    );
                  })}{" "}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Assigned Stops" checked>
              <LeafletLayerGroup>
                {assignedMapPoints?.length > 0 &&
                  assignedMapPoints.map((stop, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="stop"
                      id={stop.id}
                      position={[stop.lat, stop.lng]}
                      color={Number(stop.color)}
                    >
                      <MapPopup name={stop.name} address={stop.address} />
                    </RouteMarker>
                  ))}{" "}
                {routeGeoJsonList.length > 0 &&
                  routeGeoJsonList.map((route) => (
                    <GeoJSON
                      key={route.id}
                      data={
                        formatGeometryString(
                          route.geoJson,
                          route.vehicleId
                        ) as unknown as GeoJsonData
                      }
                      style={getStyle}
                    />
                  ))}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
            <LayersControl.Overlay name="Unassigned Stops" checked>
              <LeafletLayerGroup>
                {unassignedMapPoints?.length > 0 &&
                  unassignedMapPoints.map((stop, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="stop"
                      id={stop.id}
                      position={[stop.lat, stop.lng]}
                      color={Number(stop.color)}
                    >
                      <MapPopup name={stop.name} address={stop.address} />
                    </RouteMarker>
                  ))}{" "}
              </LeafletLayerGroup>
            </LayersControl.Overlay>
          </LayersControl>
        </MapContainer>
      </ContextMenuTrigger>

      {latLng && (
        <ContextMenuContent className="z-50">
          <ContextMenuLabel>
            {latLng?.lat ?? 0}, {latLng?.lng ?? 0}
          </ContextMenuLabel>
          <ContextMenuItem onClick={() => addJobByLatLng({ ...latLng })}>
            Add as Stop
          </ContextMenuItem>
        </ContextMenuContent>
      )}
    </ContextMenu>
  );
});
RoutingMap.displayName = "RoutingMap";
export default RoutingMap;
