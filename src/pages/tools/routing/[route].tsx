import polyline from "@mapbox/polyline";

import dynamic from "next/dynamic";
import React, { FC, Suspense, useCallback, useEffect, useState } from "react";

import ToolLayout from "~/layouts/tool-layout";
import { supabase } from "~/server/supabase/client";
import type { CalculatedStep, GeoJsonData, Step, VehicleInfo } from "~/types";
import {
  convertSecondsToTime,
  convertTime,
  formatTime,
  lookupAddress,
} from "~/utils/routing";

const DynamicMapWithNoSSR = dynamic(
  () => import("~/components/tools/routing/organisms/TempMap"),
  {
    loading: () => <p>Loading...</p>,
    ssr: false,
  }
);

import "leaflet-geosearch/dist/geosearch.css";
import "leaflet/dist/leaflet.css";

import type { GetServerSidePropsContext } from "next";

export const getServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const { data, error } = await supabase.storage
    .from("routes")
    .download(`${context.query.route as string}.json`);

  if (!data)
    return {
      redirect: {
        destination: `/tools/routing`,
        permanent: false,
      },
    };

  if (error)
    return {
      redirect: {
        destination: `/tools/routing`,
        permanent: false,
      },
    };

  const arrayBuffer = await data.arrayBuffer();
  const jsonString = new TextDecoder("utf-8").decode(arrayBuffer);
  const jsonObject = JSON.parse(jsonString);

  const addresses: string[] = [];

  if (jsonObject.steps && jsonObject.steps.length > 0) {
    for (const step of jsonObject.steps) {
      if (step.location)
        try {
          const { display_name } = await lookupAddress(
            String(step?.location[1]),
            String(step?.location[0])
          );
          addresses.push(display_name as string);
        } catch (error) {
          addresses.push("Address not found");
          console.error("Error while reverse geocoding:", error);
        }
    }
  }

  return { props: { data: jsonObject, steps: jsonObject.steps, addresses } };
};

interface IProps {
  data: VehicleInfo;
  steps: CalculatedStep[];
  addresses: string[];
}

const RoutePage: FC<IProps> = ({ data, steps, addresses }) => {
  const [geometry, setGeometry] = useState<GeoJsonData | null>(null);

  const generateGeometry = useCallback((rawGeo: string) => {
    const geo = polyline.toGeoJSON(rawGeo);
    return { ...geo, properties: { color: 2 } };
  }, []);

  useEffect(() => {
    if (data) {
      setGeometry(generateGeometry(data.geometry) as GeoJsonData);
    }
  }, [data, addresses, generateGeometry]);

  useEffect(() => {
    if (geometry) console.log(geometry);
  }, [geometry]);

  const startTime = formatTime(steps[0]?.arrival ?? 0);
  const endTime = formatTime(steps[steps.length - 1]?.arrival ?? 0);

  return (
    <ToolLayout>
      <section className="h-6/12 flex w-full flex-col justify-between bg-white md:w-full lg:h-full lg:w-5/12 xl:w-4/12 2xl:w-4/12">
        <div className="flex flex-col gap-2">
          {addresses && steps && steps.length > 0 && addresses.length > 0 && (
            <div className="bg-white p-2 shadow">
              <div className="flex items-center justify-between">
                <p className="pb-2 font-bold text-slate-800">
                  {data.description} (
                  <span>
                    {startTime} to {endTime}
                  </span>
                  )
                </p>
              </div>
              <ul
                role="list"
                className="list-disc space-y-3 pl-5 text-slate-500 marker:text-sky-400"
              >
                <li>
                  <span className="flex w-full text-sm font-bold">
                    {startTime}
                  </span>{" "}
                  <span className="font-base flex w-full text-sm text-slate-700">
                    Start at:&nbsp;
                  </span>{" "}
                  <span className="flex w-full text-sm font-semibold  text-slate-700">
                    {" "}
                    {addresses[0]}
                  </span>
                </li>
                {steps.map((step: CalculatedStep, idx: number) => (
                  <>
                    {step.id && step.id >= 0 && (
                      <li key={`step-${step.id}`}>
                        <span className="flex w-full text-sm font-medium capitalize">
                          {convertSecondsToTime(step?.arrival)}
                        </span>

                        <span className="font-base flex w-full text-sm text-slate-700">
                          {step.type === "job" ? "Delivery at:" : `Break time `}
                          &nbsp;
                        </span>
                        <span className="flex w-full text-sm font-semibold text-slate-700">
                          {step.type === "job" ? addresses[idx] : ""}
                        </span>
                      </li>
                    )}
                  </>
                ))}
                <li>
                  <span className="flex w-full text-sm font-bold">
                    {endTime}
                  </span>

                  <span className="font-base flex w-full text-sm text-slate-700">
                    End back at:&nbsp;
                  </span>
                  <span className="flex w-full text-sm font-semibold text-slate-700">
                    {addresses[0]}
                  </span>
                </li>
              </ul>
            </div>
          )}
        </div>
      </section>
      <section className="relative z-0  flex aspect-square w-full flex-grow overflow-hidden  pl-8 lg:aspect-auto lg:w-7/12 xl:w-9/12 2xl:w-9/12">
        {geometry && steps && (
          <Suspense fallback={<p>Loading map...</p>}>
            <DynamicMapWithNoSSR steps={steps} geojson={geometry} />
          </Suspense>
        )}
      </section>
    </ToolLayout>
  );
};

export default RoutePage;
