import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type MouseEventHandler,
} from "react";

import type L from "leaflet";

//import "leaflet-lasso"
interface LassoControlOptionsData  {
  title?: string;
}

interface LassoHandlerOptions {
  polygon?: L.PolylineOptions,
  intersect?: boolean;
}
type LassoControlOptions = L.ControlOptions & LassoControlOptionsData & LassoHandlerOptions;


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

import { useMediaQuery } from "~/hooks/use-media-query";
import { pusherClient } from "~/server/soketi/client";
import { cn } from "~/utils/styles";
import { MobileDrawer } from "../mobile/mobile-drawer.wip";
import { DynamicMapViewButtons } from "./dymamic-map-view-buttons";
import { MapViewButton } from "./map-view-button";

interface MapProps {
  className?: string;
  children?: React.ReactNode;
  showAdvanced: boolean;
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

const RoutingMap = forwardRef<MapRef, MapProps>(
  ({ className, children, showAdvanced}, ref) => {
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

    const LIGHTBLUE = "#0000003a";
    const [selectedJobIds, setSelectedJobIds] = useState<string[]>([]);
    useEffect(() => {
      if (mapRef.current) {
        import('leaflet-lasso').then(() => {
          if (!mapRef.current) return;

          L.control.lasso().addTo(mapRef.current);

          // Listen for lasso.finished event to get selected layers
          mapRef.current.on('lasso.finished', (event) => {
            const selectedLayers = event.layers;
            const tempSelectedJobIds: string[] = [];

            // We use a side-effect of leaflet + Soldiarity Routing code
            //  where if the map is redrawn, the pop up revert to their default
            //  background color
            //
            // We really shouldn't be depending on side effects but don't have time to
            // continue to refactor and make the app more organized
            //
            // The upshot is that on lasso.finished (or a lasso click) that contain no
            // markers, all marker background's are reset

            selectedLayers.forEach((layer) => {
              const { address, id, kind, name } = layer.options.children.props.children.props;
              console.log({ address, id, kind, name });

              if (layer instanceof L.Marker && layer.options.icon) {
                tempSelectedJobIds.push(id); // we let a useEffect on selectedJobIds do the coloring
              }
            });

            setSelectedJobIds(tempSelectedJobIds);
          });
        }).catch(error => console.error("Failed to load leaflet-lasso", error));
      }
      // Cleanup
      return () => {
        if (mapRef.current) {
          mapRef.current.off('lasso.finished');
        }
      };
    }, [mapRef.current, showAdvanced]);


    useEffect(() => {// we color the known jobId
        console.log(selectedJobIds, '... are jobId')
        if(mapRef.current){
          mapRef.current.eachLayer((layer) => {
            if (layer instanceof L.Marker && 
                layer.options.icon && 
                selectedJobIds.includes(layer.options.children.props.children.props?.id
            )) {
              // Extract the existing icon options
              const existingIconOptions = layer.options.icon.options;
              // Modify the HTML string to change the background color
              const newHtml = existingIconOptions.html.replace(/background-color: [^;]+;/, 'background-color: #ADD8E6;');
              // Create a new icon with the modified HTML and existing options
              const newIcon = L.divIcon({
                ...existingIconOptions, // Spread existing options to preserve them
                html: newHtml, // Override the html property with the modified string
              });
              // Set the new icon to the layer
              layer.setIcon(newIcon);
            }
          });
        }

    }, [mapRef.current, showAdvanced, selectedJobIds]);// uses showAdvanced as a toggle

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
    const [snap, setSnap] = useState<number | string | null>(0.1);
    const isDesktop = useMediaQuery("(min-width: 1024px)");
    return (
      <>
        {/* {mapRef.current && pathId && !isDesktop && (
          <>
            <DynamicMapViewButtons mapRef={mapRef.current} snap={snap} />
            <MobileDrawer snap={snap} setSnap={setSnap} />
          </>
        )} */}

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
                  position={[
                    currentLocation.latitude!,
                    currentLocation.longitude!,
                  ]}
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
                        id={vehicleId}
                        kind="DRIVER"
                      />
                    </RouteMarker>
                  );
                })}
              <LayersControl position="topright">
                <LayersControl.Overlay name="Drivers" checked>
                  <LeafletLayerGroup>
                    {driverMapPoints?.length > 0 &&
                      driverMapPoints.map((vehicle, idx) => {
                        const latLng: [number, number] = [
                          vehicle.lat,
                          vehicle.lng,
                        ];

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
                              id={vehicle.id}
                              kind="DRIVER"
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
                          <MapPopup
                            name={stop.name}
                            address={stop.address} 
                            id={stop.id}
                            kind="CLIENT"
                          />
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
                          <MapPopup 
                            name={stop.name}
                            address={stop.address}
                            id={stop.id}
                            kind="CLIENT"
                            />
                        </RouteMarker>
                      ))}{" "}
                  </LeafletLayerGroup>
                </LayersControl.Overlay>
              </LayersControl>
            </MapContainer>
          </ContextMenuTrigger>

          {latLng && (
            <ContextMenuContent className="z-50 flex justify-center">
              <ContextMenuItem onClick={() => addJobByLatLng({ ...latLng })}>
                <div className="flex flex-col items-center justify-center">
                  <div>Add Client here</div>
                  <div className="text-gray-500 text-sm">
                    ({latLng?.lat.toFixed(2) ?? 0}, {latLng?.lng.toFixed(2) ?? 0})
                  </div>
                </div>
              </ContextMenuItem>

              <ContextMenuItem onClick={() => addDriverByLatLng({ ...latLng })}>
                <div className="flex flex-col items-center justify-center">
                  <div>Add Driver here</div>
                  <div className="text-gray-500 text-sm">
                    ({latLng?.lat.toFixed(2) ?? 0}, {latLng?.lng.toFixed(2) ?? 0})
                  </div>
                </div>
              </ContextMenuItem>

          </ContextMenuContent>
          )}
        </ContextMenu>
      </>
    );
  }
);
RoutingMap.displayName = "RoutingMap";
export default RoutingMap;
