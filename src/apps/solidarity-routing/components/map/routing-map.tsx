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

import RouteMarker, { StopIcon, PositionIcon } from "~/apps/solidarity-routing/components/map/route-marker";
import { useDepot } from '~/apps/solidarity-routing/hooks/depot/use-depot';

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

// Add lasso selections to the route store
import { useStopsStore } from '~/apps/solidarity-routing/hooks/jobs/use-stops-store'


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

const isDriverFromURL = window.location.href.includes("driverId");

const RoutingMap = forwardRef<MapRef, MapProps>(
  ({ className, children, showAdvanced}, ref) => {
    const mapRef = useRef<LeafletMap>(null);

    const [enableTracking, setEnableTracking] = useState(false);

    const { setSelectedJobIds, selectedJobIds } = useStopsStore((state) => ({
      setSelectedJobIds: state.setSelectedJobIds,
      selectedJobIds: state.selectedJobIds,
    }));

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
      (stop) => stop.color === "-1" || !selectedJobIds.includes(stop.id)
    );

    const assignedMapPoints: MapPoint[] = stopMapPoints.filter(
      (stop) => stop.color !== "-1" && selectedJobIds.includes(stop.id)
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

    // LASSO Effects
    const LIGHTBLUE = "#0000003a";
    useEffect(() => {
      if (mapRef.current && !isDriverFromURL) {
        import('leaflet-lasso').then(() => {
          if (!mapRef.current) return;

          L.control.lasso().addTo(mapRef.current);

          // Listen for lasso.finished event to get selected layers
          mapRef.current.on('lasso.finished', (event) => {
            if (assignedMapPoints.length > 0){
              console.log("Can't lasso after establishing a route!")
              return
            } // lasso'ing after assignment screws up route logic; need to wipe route first
            const tempSelectedJobIds: string[] = [];

            event.layers.forEach((layer) => {
              const { address, id, kind, name } = layer.options?.children.props.children.props;
              console.log(
                id,
                address, 
                kind, 
                name
              );
              tempSelectedJobIds.push(id)
            });
            setSelectedJobIds(tempSelectedJobIds)
          });
        });
      }
      // Cleanup
      return () => {
        if (mapRef.current) {
          mapRef.current.off('lasso.finished');
        }
      };
    }, [mapRef.current]);

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


    // Stop Color | wasSelected   | Marker Assignment
    // --------------------------------------------
    //      TODO fill in this chart??
    // * Stop Color -1 means the stop hasn't been assigned to a route, the 
    // default state.

    const assignAnIcon = (stop, stopColor, wasSelected, id) => {
      // Case Unlassoed and we tried to route but couldn't (?)
      if(stopColor === "-1" && wasSelected === false){
        return StopIcon("#FF10106a", '-')
      }

      // Case Lasso'ed and unrouted --> drivers can't reach those customers
      if(stopColor === "-1" && wasSelected === true){
        return StopIcon("#90F4005a", '+')
      }

      // Case Unlassoed & Unrouted
      if(stopColor !== "-1" && wasSelected === false){
        return StopIcon("#0000003a", '')
      }

      return StopIcon(
          "#000000",
          'ERROR COLORING THIS STOP!'
          )
      }

    const { currentDepot } = useDepot();
    let useThisCenter = MAP_DATA.center;
    if (currentDepot?.address?.latitude && currentDepot?.address?.longitude) {
      useThisCenter = [currentDepot.address.latitude, currentDepot.address.longitude];
    }

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
              center= {useThisCenter}//{MAP_DATA.center} // {useThisCenter}//
              zoom={MAP_DATA.zoom}
              doubleClickZoom={MAP_DATA.doubleClickZoom}
              maxBounds={MAP_DATA.maxBounds}
              minZoom={MAP_DATA.minZoom}
              style={MAP_DATA.style}
              className={"relative"}
            >
              {/*
                see:

                # Toner paper
                https://tiles.stadiamaps.com/tiles/stamen_toner/{z}/{x}/{y}.png

                # Water color
                https://tiles.stadiamaps.com/tiles/stamen_watercolor/{z}/{x}/{y}.jpg

                # Humantarian
                https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png

                default: https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png
              */}
              <TileLayer
                url="https://a.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
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
                          // LET DEFAULT color assign icon!
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
                    {
                    unassignedMapPoints?.length > 0 &&
                      unassignedMapPoints.map((stop, idx) => (
                        <RouteMarker
                          key={idx}
                          variant="stop"
                          id={stop.id}
                          position={[stop.lat, stop.lng]}
                          color={Number(stop.color)}
                          useThisIconInstead={
                            assignAnIcon(
                              stop,
                              stop.color,
                              selectedJobIds.includes(stop.id),
                              ""
                            )
                          }
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
