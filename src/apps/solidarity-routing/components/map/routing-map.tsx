import { createHash } from "crypto";
import type L from "leaflet";
import type { LatLngExpression, Map } from "leaflet";
import {
  forwardRef,
  useImperativeHandle,
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

import { Expand } from "lucide-react";
import { cn } from "~/utils/styles";
import { MAP_DATA } from "../../data/map-data";
import { useDriverVehicleBundles } from "../../hooks/drivers/use-driver-vehicle-bundles";
import { useClientJobBundles } from "../../hooks/jobs/use-client-job-bundles";
import { useRoutePlans } from "../../hooks/plans/use-route-plans";
import { formatGeometryString } from "../../services/optimization/aws-vroom/utils";
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
  color: string;
};

const RoutingMap = forwardRef<MapRef, MapProps>(({ className }, ref) => {
  const mapRef = useRef<Map>(null);

  const [enableTracking, setEnableTracking] = useState(false);

  const params = {
    mapRef: mapRef.current!,
    trackingEnabled: true,
    constantUserTracking: enableTracking,
  };

  const {
    convertSolutionToGeoJSON,
    expandViewToFit,
    flyToCurrentLocation,
    currentLocation,
  } = useMap(params);
  const [latLng, setLatLng] = useState<L.LatLng | null>(null);

  const driverBundles = useDriverVehicleBundles();
  const jobBundles = useClientJobBundles();
  const routePlans = useRoutePlans();

  const COLOR_ARRAY_SIZE = 19;

  const cuidToIndex = (cuid: string, arraySize: number): number => {
    // Calculate SHA-256 hash digest
    const hashDigest = createHash("sha256").update(cuid).digest("hex");
    // Convert digest to integer
    const hashInt = parseInt(hashDigest, 16);
    // Map the hash integer to the range of the array size
    const index = hashInt % arraySize;
    return index;
  };

  // const drivers = bundles?.all;
  const addDriverByLatLng = driverBundles.createByLatLng;
  const addJobByLatLng = jobBundles.createByLatLng;

  const { currentRoutingSolution } = useRoutingSolutions();

  useImperativeHandle(ref, () => ({
    reactLeafletMap: mapRef.current,
  }));

  const handleRightClick = (event: MouseEvent) => {
    if (!mapRef.current) return;
    setLatLng(mapRef.current.mouseEventToLatLng(event));
  };

  const stopMapPoints: MapPoint[] = jobBundles.data.map((stop) => ({
    id: stop.job.id,
    type: "job",
    lat: stop.job.address.latitude,
    lng: stop.job.address.longitude,
    address: stop.job.address.formatted,
    name: stop?.client?.name ?? "New Stop",
    color: !stop.job.isOptimized
      ? "-1"
      : `${cuidToIndex(
          routePlans.findVehicleIdByJobId(stop.job.id),
          COLOR_ARRAY_SIZE
        )}`,
  }));

  const driverMapPoints: MapPoint[] = driverBundles?.data?.map((driver) => ({
    id: driver.vehicle.id,
    type: "vehicle",
    lat: driver.vehicle.startAddress?.latitude,
    lng: driver.vehicle.startAddress?.longitude,
    address: driver.vehicle.startAddress?.formatted ?? "",
    name: driver?.driver?.name ?? "Driver",
    color:
      routePlans.optimized.length > 0
        ? `${cuidToIndex(driver.vehicle.id, COLOR_ARRAY_SIZE)}`
        : "3",
  }));

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

          <div>
            <Button
              size={"icon"}
              className={cn(
                "absolute bottom-16 right-3 z-[1000]",
                !enableTracking && "bottom-3"
              )}
              onClick={expandViewToFit}
            >
              <Expand />
            </Button>

            {enableTracking && (
              <Button
                className={cn("absolute bottom-3 right-3 z-[1000]")}
                onClick={flyToCurrentLocation}
              >
                Center to Location
              </Button>
            )}

            <Button
              className={cn(
                "absolute bottom-3 right-44 z-[1000]",
                !enableTracking && "right-16"
              )}
              variant={enableTracking ? "secondary" : "default"}
              onClick={() => setEnableTracking(!enableTracking)}
            >
              {enableTracking ? "Stop" : "Start"} Realtime Tracking
            </Button>
          </div>

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
                      color={Number(vehicle.color)}
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
                {stopMapPoints?.length > 0 &&
                  stopMapPoints.map((stop, idx) => (
                    <RouteMarker
                      key={idx}
                      variant="stop"
                      id={stop.id}
                      position={[stop.lat, stop.lng]}
                      color={Number(stop.color)}
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

          {routePlans.optimized.length > 0 &&
            routePlans.optimized.map((route) => (
              <GeoJSON
                key={route.id}
                data={
                  formatGeometryString(
                    route.geoJson,
                    route.vehicleId as string
                  ) as unknown as GeoJsonData
                }
                style={getStyle}
              />
            ))}

          {/* {currentRoutingSolution && (
            <GeoJSON
              data={
                convertSolutionToGeoJSON(routePlans.data.) as GeoJsonData
              }
              style={getStyle}
            />
          )} */}
        </MapContainer>
      </ContextMenuTrigger>

      {latLng && (
        <ContextMenuContent className="z-50">
          <ContextMenuLabel>
            {latLng?.lat ?? 0}, {latLng?.lng ?? 0}
          </ContextMenuLabel>
          <ContextMenuItem
            onClick={() => addJobByLatLng(latLng?.lat, latLng?.lng)}
          >
            Add as Stop
          </ContextMenuItem>
          <ContextMenuItem
            onClick={() =>
              addDriverByLatLng({ lat: latLng?.lat, lng: latLng?.lng })
            }
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
