import dynamic from "next/dynamic";
import Head from "next/head";
import Pusher from "pusher-js";
import { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { env } from "~/env.mjs";
import ToolLayout from "~/layouts/tool-layout";

const LazyTrackingMap = dynamic(
  () => import("~/components/tools/routing/organisms/TrackingMap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

const TrackingPage = () => {
  // useEffect(() => {
  //   navigator.geolocation.getCurrentPosition((position) => {
  //     const { latitude, longitude } = position.coords;
  //     const pusher = new Pusher(env.NEXT_PUBLIC_PUSHER_APP_KEY, {
  //       cluster: "us2",
  //     });

  //     const channel = pusher.subscribe("map");
  //     channel.bind("update-location", (data) => {
  //       console.log(data);
  //       // Update the map with new location data
  //     });
  //     fetch("/api/update-location", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ latitude, longitude }),
  //     }).catch((error) => {
  //       console.log(error);
  //     });
  //   });
  // }, []);
  return (
    <>
      <ToolLayout>
        <h1>Driver Tracking</h1>{" "}
        <section className="relative z-0  flex aspect-square w-full flex-grow overflow-hidden  pl-8 lg:aspect-auto lg:w-7/12 xl:w-9/12 2xl:w-9/12">
          <LazyTrackingMap />
        </section>
      </ToolLayout>
    </>
  );
};

export default TrackingPage;
