import CarMarker from "~/components/tools/routing/atoms/map/CarMarker";

import StopMarker from "~/components/tools/routing/atoms/map/StopMarker";

import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import {
  GeoJSON,
  MapContainer as LMapContainer,
  TileLayer,
} from "react-leaflet";

import useOpenRoute from "~/hooks/useOpenRoute";
import type { Step } from "~/types";
import {
  convertTime,
  formatTime,
  getStyle,
  lookupAddress,
} from "~/utils/routing";

export const MapContainer = ({ forwardedRef, ...props }) => {
  //   const mapRef = useRef<any>(null);

  //   const { reverseOptimization } = useOpenRoute();
  //   // Get data from URL param

  //   const [geometry, setGeometry] = useState<any>(null);
  //   const [steps, setSteps] = useState<any>(null);

  console.log(props.data);

  //   useEffect(() => {
  //     if (steps && steps.length > 0 && mapRef.current) {
  //       const bounds = L.latLngBounds(
  //         steps
  //           .filter((step: any) => step.type !== "break")
  //           .map((step: any) => [step.location[1], step.location[0]])
  //       );
  //       const increasedBounds = bounds.pad(0.15);
  //       mapRef.current.fitBounds(increasedBounds);
  //     }

  //     const fetchData = async () => {
  //       if (steps && steps.length > 0) {
  //         const addresses: string[] = [];
  //         for (const step of steps) {
  //           try {
  //             const { display_name } = await lookupAddress(
  //               String(step.location[1]),
  //               String(step.location[0])
  //             );
  //             addresses.push(display_name);
  //           } catch (error) {
  //             addresses.push("Address not found");
  //             console.error("Error while reverse geocoding:", error);
  //           }
  //         }
  //         setStepAddresses(addresses);
  //       }
  //     };

  //     fetchData();
  //   }, [steps]);

  //   useEffect(() => {
  //     if (data) {
  //       //   setResults(data);
  //       setSteps(data.steps);

  //       reverseOptimization(data.geometry).then((res) => {
  //         setGeometry(res);
  //       });
  //     }
  //   }, []);

  return (
    <LMapContainer
      ref={forwardedRef}
      center={[42.279594, -83.732124]}
      zoom={15}
      style={{
        height: "100%",
        width: "100%",
        zIndex: -1,
      }}
      doubleClickZoom={false}
      maxBounds={[
        [40.70462625, -91.6624658],
        [49.29755475, -80.8782742],
      ]}
      minZoom={6.5}
    >
      {/* //   <TileLayer
    //     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    //     attribution='Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
    //   />{" "}
    //   {steps &&
    //     steps.length > 0 &&
    //     steps
    //       .filter((step: any) => step.type !== "break")
    //       .map((step: any, index: number) => {
    //         if (step.type === "job")
    //           return (
    //             <StopMarker
    //               key={index}
    //               position={[step.location[1], step.location[0]]}
    //               name={`Step ${index + 1}`}
    //               id={step.id}
    //               colorMapping={index}
    //             />
    //           );
    //         else
    //           return (
    //             <CarMarker
    //               position={[step.location[1], step.location[0]]}
    //               name={`${index}`}
    //               key={index}
    //             />
    //           );
    //       })}
    //   {geometry && <GeoJSON data={geometry} style={getStyle} />} */}
    </LMapContainer>
  );
};
