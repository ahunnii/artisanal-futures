import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import ToolLayout from "~/layouts/tool-layout";

const LazyTrackingMap = dynamic(
  () => import("~/components/tools/routing/organisms/TrackingMap"),
  {
    ssr: false,
    loading: () => <div>loading...</div>,
  }
);

const TrackingPage = () => {
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
