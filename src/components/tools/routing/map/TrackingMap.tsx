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

import { env } from "~/env.mjs";
import { useRequestStore } from "~/store";
import { convertSecondsToTime, getStyle, getUniqueKey } from "~/utils/routing";

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";
import { useSession } from "next-auth/react";
import Pusher from "pusher-js";
import { useDrivers } from "~/hooks/routing/use-drivers";
import { useStops } from "~/hooks/routing/use-stops";
// import useTracking from "~/hooks/routing/use-tracking";
import { LayersControl, LayerGroup as LeafletLayerGroup } from "react-leaflet";
import type { CalculatedVehicleData, GeoJsonData } from "~/types";
import { getColor } from "~/utils/routing";
import { convertMetersToMiles } from "~/utils/routing/data-formatting";
import { ExpandedRouteData, PusherUserData } from "../types";
import MapSearch from "./MapSearch";
import RouteMarker from "./route-marker";

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

type PusherLocation = {
  userId: number;
  latitude: number;
  longitude: number;
  accuracy: number;
};

const TrackingMap = ({ activeUsers }: { activeUsers: PusherUserData[] }) => {
  const [markers, setMarkers] = useState<L.Marker[]>([]);
  const [circles, setCircles] = useState<L.Circle[]>([]);
  // const [pusherLocations, setPusherLocations] = useState<PusherLocation[]>([]);
  const { data: session } = useSession();

  const mapRef = useRef<Map>(null);

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

  // const { pusherLocations } = useTracking();

  useEffect(() => {
    // if (!navigator.geolocation) {
    //   console.log("Your browser doesn't support the geolocation feature!");
    //   return;
    // }
    // const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
    //   cluster: "us2",
    // });
    // const channel = pusher.subscribe("map");
    // const intervalId = setInterval(() => {
    //   navigator.geolocation.getCurrentPosition((position) => {
    //     const { latitude, longitude, accuracy } = position.coords;
    //     channel.bind("update-locations", (data: PusherLocation[]) => {
    //       console.log(data);
    //       setPusherLocations(data);
    //     });
    //     fetch("/api/update-location", {
    //       method: "POST",
    //       headers: { "Content-Type": "application/json" },
    //       body: JSON.stringify({
    //         userId: session?.user?.id ?? 0,
    //         latitude,
    //         longitude,
    //         accuracy,
    //       }),
    //     }).catch((error) => {
    //       console.log(error);
    //     });
    //   });
    // }, 5000);
    // return () => {
    //   clearInterval(intervalId);
    // };
  }, [session]);
  // useEffect(() => {
  //   if (pusherLocations?.length) {
  //     // Clear previous markers and circles
  //     if (markers) markers?.forEach((marker) => marker.remove());
  //     circles?.forEach((circle) => circle.remove());

  //     const newMarkers: L.Marker[] = [];
  //     const newCircles: L.Circle[] = [];

  //     // // Your existing code to add marker and circle for the current user
  //     // const newMarker = L.marker([lat, long], {
  //     //   icon: trackingMarker({
  //     //     colorMapping: 0,
  //     //   }),
  //     // });
  //     // const newCircle = L.circle([lat, long], { radius: accuracy });

  //     // newMarkers.push(newMarker);
  //     // newCircles.push(newCircle);

  //     // Mapping through pusherLocations to add new markers and circles
  //     pusherLocations.forEach((loc) => {
  //       const pusherMarker = L.marker([loc?.latitude, loc?.longitude], {
  //         icon: trackingMarker({
  //           colorMapping: 0,
  //         }),
  //       });
  //       const pusherCircle = L.circle([loc?.latitude, loc?.longitude], {
  //         radius: loc.accuracy,
  //       });

  //       newMarkers.push(pusherMarker);
  //       newCircles.push(pusherCircle);
  //     });

  //     // Add new markers and circles to the map
  //     newMarkers.forEach((marker) => marker.addTo(mapRef.current!));
  //     newCircles.forEach((circle) => circle.addTo(mapRef.current!));

  //     // Update state with new markers and circles
  //     setMarkers(newMarkers);
  //     setCircles(newCircles);

  //     const featureGroup = L.featureGroup([...newMarkers, ...newCircles]).addTo(
  //       mapRef.current!
  //     );

  //     mapRef.current!.fitBounds(featureGroup.getBounds());
  //   }
  // }, [pusherLocations]);
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

      <LayersControl position="topright">
        {" "}
        <LayersControl.Overlay name="Drivers" checked>
          <LeafletLayerGroup>
            {activeUsers?.length &&
              activeUsers.map((vehicle, idx) => {
                const { name } = JSON.parse(
                  vehicle?.route?.description ?? "{}"
                );

                const startTime = convertSecondsToTime(
                  vehicle?.route?.steps?.[0]?.arrival ?? 0
                );
                const endTime = convertSecondsToTime(
                  (vehicle?.route?.steps?.[0]?.arrival ?? 0) +
                    vehicle?.route?.setup +
                    vehicle?.route?.service +
                    vehicle?.route?.waiting_time +
                    vehicle?.route?.duration
                );
                const numberOfStops = vehicle?.route?.steps?.filter(
                  (step) => step.type === "job"
                ).length;

                return (
                  <RouteMarker
                    key={idx}
                    variant="car"
                    id={idx}
                    position={[vehicle.latitude, vehicle.longitude]}
                    color={idx}
                  >
                    <div className="flex flex-col space-y-2">
                      <span className="block text-base font-bold capitalize">
                        {name ?? "Driver "}
                      </span>
                      <span className="block">
                        <span className="block font-semibold text-slate-600">
                          Route Details
                        </span>
                        Start {startTime} • End {endTime} • {numberOfStops}{" "}
                        stops • {convertMetersToMiles(vehicle?.route?.distance)}{" "}
                        miles
                      </span>
                    </div>
                  </RouteMarker>
                );
              })}{" "}
          </LeafletLayerGroup>
        </LayersControl.Overlay>
      </LayersControl>

      {/* 
      <MapSearch
        provider={
          new GoogleProvider({
            apiKey: env.NEXT_PUBLIC_GOOGLE_MAP_API_KEY,
          })
        }
      /> */}
      {/* @ts-ignore */}
      {/* {geojsonData && <GeoJSON data={geojsonData} style={getStyle} />} */}
    </MapContainer>
  );
};

export default TrackingMap;
